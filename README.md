# 🌍 Smart Travel Itinerary Planner (MERN)

A comprehensive MERN stack web application for planning trips with advanced features including multi-destination support, budget tracking, activity scheduling, time-based planning, and trip sharing.

## 🚀 Features

### 1️⃣ User Profile Enhancements

- **Profile Management**: View and edit user profile with enhanced information
- **Travel Preferences**: Store travel style (e.g., "Adventurous", "Relaxed")
- **Budget Preferences**: Define overall travel budget preferences
- **Profile Notes**: Add personal travel notes and preferences
- **Preferences JSON**: Store custom user preferences

### 2️⃣ Advanced Trip Management

- **Multi-Destination Support**: Plan trips across multiple destinations
- **Trip Titles**: Meaningful trip names instead of just destinations
- **Trip Status**: Track trip status (planning, ongoing, completed)
- **Archive Trips**: Archive old trips while preserving data
- **Total Budget**: Set and track overall trip budget
- **Trip Editor Modal**: Edit trip details after creation

### 3️⃣ Time-Based Itinerary Planning

- **Activity Scheduling**: Set start and end times for activities
- **Visual Timeline**: See activities on an hourly timeline for each day
- **Overlap Detection**: Automatically detect and warn about scheduling conflicts
- **Conflict Badges**: Visual indicators for overlapping activities
- **Activity Time Display**: Show activity duration and time slots

### 4️⃣ Enhanced Activity Management

- **Activity Types**: Categorize activities (e.g., "Sightseeing", "Dining", "Rest")
- **Location Tracking**: Store location/address for each activity
- **Cost Tracking**: Record activity costs for budget planning
- **Activity Notes**: Add detailed notes to activities
- **Duration Estimation**: Estimate activity duration in minutes
- **Completed Status**: Mark activities as completed
- **Optional Activities**: Mark activities as optional/flexible
- **Activity Reordering**: Drag-and-drop to reorder activities within a day
- **Activity Move**: Move activities between days

### 5️⃣ Budget Tracking System

- **Overall Trip Budget**: Set total budget for the trip
- **Daily Budgets**: Define daily spending limits
- **Budget Progress Bar**: Visual representation of daily spending
- **Over-Budget Alerts**: Warnings when spending exceeds budget
- **Cost Summary**: View total costs by day and activity
- **Budget Analytics**: See budget utilization across the trip

### 6️⃣ Travel Time & Buffer Logic

- **Activity Overlap Detection**: Server validates and warns about time conflicts
- **Client-Side Conflict Detection**: Instant visual feedback on scheduling issues
- **Timeline View**: Hourly timeline display showing all activities
- **Activity Duration Display**: Clear start and end times for each activity

### 7️⃣ Notes & Checklist System

- **Daily Notes**: Add detailed notes for each day
- **Day Checklists**: Create and manage per-day checklists
- **Checklist Items**: Add, complete, and remove checklist items
- **Persistent Storage**: All notes and checklists saved to database

### 8️⃣ Sharing & Collaboration

- **Trip Sharing**: Invite collaborators by email
- **Collaborator Management**: Add and remove collaborators
- **Collaborator Roles**: Define collaborator permissions (Viewer, Editor)
- **Share Modal**: User-friendly interface for managing collaborators
- **Collaborator List**: View all trip collaborators

### 9️⃣ Trip Overview & Analytics

- **Dashboard Page**: Main landing page showing all trips
- **Trip Statistics**: Display active trips, total days, and budget
- **Activity Type Distribution**: Charts showing activity category breakdown
- **Daily Cost Breakdown**: Visual representation of daily spending
- **Completion Rate**: Track percentage of completed activities
- **Budget Utilization**: Overall and per-day budget analysis
- **Trip Cards**: Quick overview of each trip with key metrics

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # User schema (profile fields added)
│   ├── Trip.js            # Trip schema (enhanced)
│   ├── Day.js             # Day schema (notes, checklist, budget)
│   └── Activity.js        # Activity schema (time, type, location, cost)
├── routes/
│   ├── auth.js            # Auth routes (signup, login, password)
│   ├── trips.js           # Trip CRUD + archive + collaborators
│   ├── activities.js      # Activity CRUD + move + reorder + overlap detection
│   ├── days.js            # Day update (notes, checklist, budget)
│   └── profile.js         # Profile get/update
├── server.js              # Express server entry point
└── package.json

frontend/
├── public/
│   └── index.html         # HTML entry point
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── Layout/
│   │   │   └── Navbar.js  # Navigation with Dashboard + Profile links
│   │   ├── Trip/
│   │   │   ├── Dashboard.js           # Trip overview & statistics
│   │   │   ├── TripList.js            # List trips with filters
│   │   │   ├── TripForm.js            # Create new trip
│   │   │   ├── TripDetail.js          # Trip detail with days/activities
│   │   │   ├── TripEditModal.js       # Edit trip (title, destinations, budget)
│   │   │   ├── TripOverview.js        # Analytics & stats display
│   │   │   ├── TripShareModal.js      # Manage collaborators
│   │   │   ├── ActivityDetailModal.js # Edit activity (time, type, cost, etc.)
│   │   │   └── ActivityTimeline.js    # Visual timeline display
│   │   ├── Profile/
│   │   │   └── Profile.js            # User profile page
│   │   └── Dashboard.js              # Main dashboard landing page
│   ├── context/
│   │   └── AuthContext.js            # Global auth state
│   ├── utils/
│   │   └── api.js                    # API helpers (axios)
│   ├── App.js                        # Main app component with routes
│   ├── App.css                       # Global styles
│   └── index.js                      # React entry point
└── package.json
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/password` - Change password

### Profile

- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Trips

- `GET /api/trips` - List all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip with days and activities
- `PUT /api/trips/:id` - Edit trip
- `PATCH /api/trips/:id/archive` - Archive/unarchive trip
- `PATCH /api/trips/:id/collaborators` - Add/remove collaborators
- `DELETE /api/trips/:id` - Delete trip

### Days

- `PUT /api/days/:id` - Update day (notes, checklist, budget)

### Activities

- `POST /api/activities` - Create activity (with overlap detection)
- `PUT /api/activities/:id` - Update activity
- `PATCH /api/activities/:id/move` - Move activity to different day
- `PATCH /api/activities/:id/reorder` - Reorder activity within day
- `DELETE /api/activities/:id` - Delete activity

## 💾 Database Schema

### User

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  travelStyle: String,              // e.g., "Adventurous"
  budgetPreference: String,         // e.g., "Budget-Friendly"
  profileNotes: String,
  preferences: Object,              // Custom preferences
  createdAt: Date
}
```

### Trip

```javascript
{
  user: ObjectId (User),
  title: String,
  destinations: [{name: String, locationHint: String}],
  startDate: Date,
  endDate: Date,
  totalBudget: Number,
  status: String,                   // "planning", "ongoing", "completed"
  archived: Boolean,
  collaborators: [{email: String, role: String, name: String}],
  createdAt: Date
}
```

### Day

```javascript
{
  trip: ObjectId (Trip),
  date: Date,
  dayNumber: Number,
  dailyBudget: Number,
  notes: String,
  checklist: [{text: String, completed: Boolean}],
  createdAt: Date
}
```

### Activity

```javascript
{
  day: ObjectId (Day),
  title: String,
  description: String,
  startTime: Date,                  // ISO datetime
  endTime: Date,                    // ISO datetime
  type: String,                     // e.g., "Sightseeing"
  location: String,
  notes: String,
  estimatedDurationMinutes: Number,
  cost: Number,
  optional: Boolean,
  completed: Boolean,
  order: Number,                    // For custom ordering
  createdAt: Date
}
```

## 🎯 Key Features Implemented

### Frontend

- ✅ Responsive UI with CSS-in-JS styling
- ✅ React Context for auth state management
- ✅ Protected routes with authentication
- ✅ Dashboard with statistics and trip management
- ✅ Activity timeline visualization
- ✅ HTML5 drag-and-drop for activity reordering
- ✅ Modal-based editors (Trip, Activity)
- ✅ Real-time conflict detection
- ✅ Budget tracking with visual progress bars
- ✅ Day notes and checklist management
- ✅ Collaborator management UI

### Backend

- ✅ Express.js REST API
- ✅ JWT authentication
- ✅ Mongoose schema with relationships
- ✅ Server-side validation
- ✅ Overlap detection for activities
- ✅ Cascading delete (trip deletes days and activities)
- ✅ Activity reordering and moving
- ✅ Collaborator endpoint

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation & Setup

#### Backend

```bash
cd backend
npm install
# Create .env file with:
# DATABASE_URL=<your-mongodb-url>
# JWT_SECRET=<your-secret-key>
# PORT=5000
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

The application will be running at `http://localhost:3000`

## 🔐 Authentication

- Users sign up and log in with email and password
- JWT token stored in localStorage
- Token automatically sent with API requests
- Protected routes redirect to login if not authenticated

## 📋 Usage

1. **Create an Account**: Sign up with email and password
2. **Create a Trip**: Click "New Trip" to start planning
3. **Plan Activities**: Add activities with time, cost, and other details
4. **Track Budget**: Monitor daily and trip-wide spending
5. **Share Trips**: Invite collaborators via email
6. **View Analytics**: Check statistics on the dashboard
7. **Manage Schedule**: Use timeline view to optimize your schedule

## 🛠️ Tech Stack

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- CORS enabled

**Frontend**

- React 18
- React Router v6
- Axios for API calls
- CSS-in-JS styling

## 📄 License

This project is open source and available under the MIT License.

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
