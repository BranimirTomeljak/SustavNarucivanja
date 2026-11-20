# Sustav naručivanja: Healthcare Appointment Booking

A web system for booking appointments in Croatian healthcare, built by a team of seven for the *Software Engineering* course at FER Zagreb (Oct 2022 – Jan 2023). Doctors publish their available appointments, patients book them, and everyone gets reminders by email and SMS.

## Features

- Accounts for patients, doctors and nurses, with registration, login and session-based authentication (Passport, bcrypt)
- Doctors publish ranges of available appointments, and patients book them through a calendar
- Medical teams that group a doctor with nurses
- Email (Nodemailer) and SMS (Vonage) notifications, with scheduled reminders for upcoming appointments
- XML reports of appointments
- Jest tests for the data models and Selenium IDE end-to-end tests
- Project documentation with UML diagrams, written in LaTeX (in Croatian)

## My part

Backend: registration, login and logout, the appointment and patient routes, the notification model with email and SMS reminders, XML reports and database seed data, plus parts of the documentation.

## Tech

Angular 14 · Angular Material · angular-calendar · Bootstrap · Node.js · Express · PostgreSQL · Passport · Nodemailer · Vonage · node-cron · Jest

## Structure

- `sustav-narucivanja/`: Angular frontend
- `sustav-narucivanja-server/`: Express backend (routes, models, database setup and seed)
- `dokumentacija/`: LaTeX documentation and diagrams
- `system_test.side`: Selenium IDE test suite
- `restart.sh`: starts the frontend and backend on a server

## Running locally

```bash
# backend: needs PostgreSQL and a .env with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE and SESSION_SECRET
cd sustav-narucivanja-server
npm install
npm run seed
npm run dev

# frontend
cd sustav-narucivanja
npm install
npm start   # http://localhost:4200
```
