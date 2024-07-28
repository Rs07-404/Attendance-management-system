# Attendance Management System

## Project Overview
The Web-Based Attendance Management System is designed to streamline attendance tracking for educational institutions. This software solution offers a user-friendly interface accessible from both desktop and mobile devices, enabling teachers to efficiently manage attendance records.

## Table of Contents
- [Introduction](#introduction)
- [Objective](#objective)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Team](#team)
- [Conclusion](#conclusion)

## Introduction
The Web-Based Attendance Management System is a software application that automates the process of recording, viewing, and editing student attendance. The system is developed using Express.js, EJS for dynamic content rendering, and PostgreSQL for database management.

## Objective
The primary objective of this system is to:
- Automate the attendance process.
- Provide teachers with an intuitive platform to manage attendance data.
- Enhance accuracy and efficiency in attendance tracking.

## Features
- **Secure Login:** Teachers can securely log into the system.
- **Home Page:** Displays a list of classes upon successful login.
- **Attendance Management:** Options to take, view, and edit attendance for selected classes.
- **Dynamic Attendance Page:** Checkboxes generated based on the number of students enrolled in the selected class.
- **Database Integration:** Attendance records are stored in a PostgreSQL database with date and time stamps.
- **View Attendance:** Displays attendance records for a specified date.
- **Edit Attendance:** Allows modification of attendance data for a specific date.

## System Architecture
The system follows a client-server architecture:
- **Frontend:** Developed using HTML, CSS, and EJS templates.
- **Backend:** Express.js serves as the web application framework.
- **Database:** PostgreSQL is used for secure storage of attendance records.

## Technologies Used
- **Frontend:** HTML, CSS, EJS
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL

## Installation
To set up the project locally, follow these steps:
1. Clone the repository:
    ```bash
    git clone https://github.com/Rs07-404/Attendance-management-system.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Attendance-management-system
    ```
3. Install the required dependencies:
    ```bash
    npm install
    ```
4. Set up the PostgreSQL database and update the database configuration in `config.js`.
5. Start the application:
    ```bash
    npm start
    ```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Log in using the credentials provided by the system administrator.
3. Select a class to manage attendance.
4. Use the interface to take, view, and edit attendance records.

## Team
- **Raunak Shah:** Backend Development

## Conclusion
The Web-Based Attendance Management System aims to revolutionize attendance tracking in educational institutions by providing a comprehensive, efficient, and user-friendly solution. By digitizing the attendance process, the system enhances accuracy, saves time, and improves overall efficiency.

---
