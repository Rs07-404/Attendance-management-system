import express from "express"
import bodyParser from "body-parser";
import pg from "pg";


//Initialization
const app = new express();
const port = 3000;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let login = [];
let login_status = false;

//Database
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "College",
    password: "postgres@rrs",
    port: 5432
  });

db.connect();

//HomePage
app.get('/', async (req,res)=>{
    if(login.length > 0){
        let id = login[0];
        let result = await db.query("SELECT * FROM subject WHERE teacher_id = $1",[id]);
        let subjects = [];
        let subject_ids = []
        let class_ids = [];
        let count = 0;
        let info = result.rows
        info.forEach(info => {
            subjects.push(info.subject_name);
            subject_ids.push(info.id);
            class_ids.push(info.class_id);
        });
        let classes = new Array();
        for(let i = 0; i < class_ids.length; i++ ) {
            result = await db.query("SELECT * FROM classes WHERE id = $1",[class_ids[i]]);
            let info = result.rows
            info.forEach(classs => {
                let classn = classs.year + ' ' + classs.department;
                let n = {
                    "class_name": classn,
                    "count": classs.student_count
                };
                classes.push(n);
            });
        };
        let data = []
        for (let i = 0; i < subject_ids.length; i++){
            let nw = {
                class_name: classes[i].class_name,
                subject_name: subjects[i],
                student_count: classes[i].count,
                id: subject_ids[i]
            };
            data.push(nw);
        }

        res.render('home.ejs',{ login: login_status, name: login[1], data: data, current_page: "Home" });
    }else{
        res.render("index.ejs");
    }
});

app.post('/login', async (req,res)=>{
    let user = req.body["username"];
    let pass = req.body["password"];
    let result = await db.query("SELECT * FROM teacher WHERE username = $1;",[user]);
    const data = result.rows[0];
    if(data){
        if(pass === data.password){
            const name = data.name;
            const id = data.id;
            login.push(id);
            login.push(name);
            login_status = true;
        }
    }
    res.redirect('/');
});

app.get('/actions/:id', async (req,res)=>{
    if(login.length > 0){
        const id = parseInt(req.params.id);
        let result = await db.query("SELECT * FROM subject WHERE id = $1;",[id])
        const subject_name = result.rows[0].subject_name;
        const class_id = result.rows[0].class_id;
        result = await db.query("SELECT year, department FROM classes WHERE id = $1",[class_id]);
        const class_name = result.rows[0].year + ' ' + result.rows[0].department;
        res.render('actions.ejs',{ login: login_status, id: id, subject_name: subject_name, class_name: class_name, current_page: "Actions",back_route: `/` });
    }else{
        res.redirect('/')
    }
});

async function get_count(id){
    let result = await db.query("SELECT class_id FROM subject WHERE id = $1",[id]);
        let class_id = result.rows[0].class_id;
        result = await db.query("SELECT student_count FROM classes WHERE id = $1",[class_id]);
        const student_count = result.rows[0].student_count;
        const data = {
            student_count: student_count,
            class_id: class_id
        }
        return data;
};

app.get('/take_attendance/:id', async (req,res)=>{
    if(login.length > 0){
        const id = parseInt(req.params.id);
        let student_count = await get_count(id);        
        res.render('attendance.ejs',{ login: login_status, id: id, count: student_count.student_count, current_page: "Attendance", back_route: `/actions/${id}` });
    }else{
        res.redirect('/')
    }
});

app.post('/submit_attendance/:id', async (req, res)=>{
    if(login.length > 0){
        let attendance = ``;
        const id = parseInt(req.params.id);
        const status = req.body.status
        let result = await get_count(id);
        let student_count = result.student_count
        for (let i = 1; i <= student_count; i ++){
            if(attendance.length < 1){
                if(req.body[`${i}`] === 'on'){
                    attendance = attendance + `${i}`
                }
            }else{
                if(req.body[`${i}`] === 'on'){
                    attendance = attendance + `,${i}`
                }
            }
        }
        const date = new Date();
        const time = date.getHours() + ":" + date.getMinutes();
        result = await db.query("INSERT INTO attendance(class_id,subject_id,attendance_time,status,roll_nos) VALUES($1,$2,$3,$4,$5)",[result.class_id, id, time, status, attendance]);
        if(result){
            res.redirect(`/take_attendance/success/${id}`);
        }
    }else{
        res.redirect('/');
    }
});

app.get('/take_attendance/success/:id', async (req,res)=>{
    if(login.length > 0){
        const id = parseInt(req.params.id);
        let result = await get_count(id);
        result = await db.query("SELECT year, department FROM classes WHERE id = $1",[result.class_id]);
        const class_name = result.rows[0].year + ' ' + result.rows[0].department;
        res.render('success.ejs',{ login: login_status, id: id, class_name: class_name, back_route: `/actions/${id}`, current_page:"Success"})
    }else{
        res.redirect('/');
    }
});

app.get('/view_attendance/:id',(req,res)=>{
    if(login.length > 0){
        const id = parseInt(req.params.id);
        res.render('view_attendance.ejs',{login: login_status, id: id, current_page: "Select Date"});
    }else{
        res.redirect('/')
    }
});

app.post('/:id/view_attendance/', async (req,res)=>{
    if(login.length > 0){
        const id = parseInt(req.params.id);
        const date = req.body.date;
        let result = await db.query("SELECT * FROM attendance WHERE (subject_id,attendance_date) = ($1,$2);",[id,date]);
        let counts = await get_count(id);
        let count = counts.student_count;
        let class_id = counts.class_id;
        let name = await db.query("SELECT year, department FROM classes WHERE id = $1",[class_id]);
        const class_name = name.rows[0].year + ' ' + name.rows[0].department;        
        let data = result.rows;
        if(data.length > 0){
            let attendance = [];
            for (let  i = 0; i < result.rows.length; i ++) {
                let present = [];
                let absent = [];
                if(data[i].status === 'P'){
                    present = data[i].roll_nos.split(/\s*,\s*/).map(num => parseInt(num));
                    for( let j = 1; j < count; j ++){
                        if(present.find(num => num === j) === undefined){
                            absent.push(j);
                        }
                    }
                }else if(data[i].status === 'A'){
                    absent = data[i].roll_nos.split(/\s*,\s*/).map(num => parseInt(num));
                    for( let j = 1; j < count; j ++){
                        if(absent.find(num => num === j) === undefined){
                            present.push(j);
                        }
                    }
                }
                let present_count = present.length;
                let absent_count = absent.length;
                present = present.join(', ');
                absent = absent.join(', ');
            
                const new_data = {
                    id: i,
                    date: `${data[i].attendance_date}`.slice(0,15),
                    time: data[i].attendance_time,
                    present_count: present_count,
                    absent_count: absent_count,
                    present: present,
                    absent: absent,
                    total_count: count,
                }
            
                attendance.push(new_data);
            }
            res.render("view_attendance.ejs",{login: login_status, id:id, current_page: "Attendance", data: attendance, class_name: class_name, back_route: `/actions/${id}`});
        }else{
            data = "No Attendance taken on this date";
            res.render("view_attendance.ejs",{login: login_status, id:id, current_page: "Attendance", error: data, back_route: `/actions/${id}`});
        }
        
    }else{
        res.redirect('/')
    }
});

app.get('/logout',(req,res)=>{
    login = [];
    login_status = false;
    res.redirect('/');
});

// app start
app.listen(port,()=>{
    console.log(`Listening on port ${port}.`);
});