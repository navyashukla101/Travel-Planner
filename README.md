🌍 Smart Travel Itinerary Planner (MERN)

A basic MERN stack web application that allows users to plan trips and create a day-wise travel itinerary.
This project focuses on core MERN fundamentals: authentication, CRUD operations, schema relationships, and REST APIs.

🚀 Features (MVP)
🔐 Authentication

User Signup & Login

JWT-based authentication

Protected routes (frontend + backend)

Kept minimal to demonstrate auth basics.

🧳 Trip Management

Create a trip with:

Destination

Start date

End date

View all trips created by the user

Delete a trip

📅 Day-wise Itinerary

Automatically generates days based on trip dates

Each trip contains multiple days

View itinerary in a day-wise structure

📝 Activity Management

Add activities manually to a specific day

Activity includes:

Title

Description

Delete activities

Activities are displayed under their respective day

🎨 UI (Simple & Clean)

Trip dashboard

Day-wise itinerary view

Basic forms and buttons

Focus on clarity and usability over advanced UI

🛠 Tech Stack

Frontend

React

Context API / basic state management

React Router

Backend

Node.js

Express.js

JWT Authentication

Database

MongoDB

Mongoose ODM

📂 Database Models

User

Trip

Day

Activity

Designed to demonstrate schema relationships and data modeling in MongoDB.

🔗 API Structure (Overview)

/api/auth

Register

Login

/api/trips

Create trip

Get user trips

Delete trip

/api/days

Auto-generated based on trip dates

/api/activities

Add activity to a day

Delete activity

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/smart-travel-itinerary-planner.git
cd smart-travel-itinerary-planner

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm start

🎯 Project Goals

Demonstrate MERN stack fundamentals

Practice REST API design

Understand JWT authentication

Implement MongoDB schema relationships

Build a realistic, meaningful CRUD application

🚧 Planned Future Enhancements

Edit trips & activities

Multiple destinations per trip

AI-powered itinerary suggestions

Activity time slots

Drag-and-drop reordering

Budget & collaboration features
