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
- **Destination Gallery**: Auto-fetched images for each destination

### 🤖 AI Travel Assistant (NEW)

- **Context-Aware AI Chat**: Integrated AI assistant accessible from anywhere
- **Natural Language Commands**: Add activities using plain English (e.g., "Add a museum visit on Day 1 at 11 AM")
- **Smart Intent Detection**: Automatically recognizes user intent:
  - **Add Activity**: Create activities by describing them in natural language
  - **Suggest Activities**: Get personalized activity recommendations for specific days
  - **Balance Trip**: Receive suggestions for better time/schedule distribution
  - **Budget Analysis**: Identify optional activities to stay within budget
  - **Travel Advice**: Answer general travel questions (packing tips, destination info, etc.)
  - **City Suggestions**: Get place-to-visit recommendations for any destination
  - **Trip Hours Calculation**: Analyze activity durations and free time
- **Global Mode**: Ask general travel questions without needing a specific trip context
- **Trip-Specific Mode**: Get recommendations tailored to your specific trip when viewing a trip
- **Real-time Feedback**: Friendly confirmation messages when activities are created

### 🖼️ Destination Image Gallery

- **Automatic Image Fetching**: Images are automatically fetched from Unsplash/Pixabay based on destination names
- **Fallback Mechanism**: Hand-curated images for popular destinations, with fallback to generic travel photos
- **Trip Overview Display**: Beautiful gallery view showing images for all trip destinations
- **API Caching**: Efficient caching to avoid redundant API calls
- **Error Handling**: Graceful degradation if images can't be fetched

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
│   ├── ai.js              # AI intent detection & routing (NEW)
│   ├── images.js          # Image fetching endpoint (NEW)
│   ├── profile.js         # Profile get/update
├── services/
│   ├── aiService.js       # AI logic & intent handlers (NEW)
│   └── imageService.js    # Image fetching from Unsplash/Pixabay (NEW)
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
│   │   │   └── Navbar.js  # Navigation with AI Assistant button (UPDATED)
│   │   ├── Trip/
│   │   │   ├── Dashboard.js           # Trip overview & statistics
│   │   │   ├── TripList.js            # List trips with filters
│   │   │   ├── TripForm.js            # Create new trip
│   │   │   ├── TripDetail.js          # Trip detail with days/activities + AI Chat
│   │   │   ├── TripEditModal.js       # Edit trip (title, destinations, budget)
│   │   │   ├── TripOverview.js        # Analytics & destination gallery (UPDATED)
│   │   │   ├── TripShareModal.js      # Manage collaborators
│   │   │   ├── ActivityDetailModal.js # Edit activity (time, type, cost, etc.)
│   │   │   └── ActivityTimeline.js    # Visual timeline display
│   │   ├── Profile/
│   │   │   └── Profile.js            # User profile page
│   │   ├── AIChat.js                 # AI Assistant component (NEW)
│   │   └── Dashboard.js              # Main dashboard landing page
│   ├── context/
│   │   └── AuthContext.js            # Global auth state
│   ├── utils/
│   │   └── api.js                    # API helpers (axios) + image search (UPDATED)
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

### AI Assistant

- `POST /api/ai/query` - Process natural language queries and AI requests
  - Body: `{ tripId (optional), message (required), budgetLimit (optional) }`
  - Returns: Intent-based responses with suggestions, recommendations, or activity creation results

### Images

- `GET /api/images/search?query=<destination>` - Fetch destination images from Unsplash/Pixabay (NEW)

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
- ✅ **AI Travel Assistant with natural language processing** (NEW)
- ✅ **Destination image gallery with auto-fetching** (NEW)
- ✅ **Global AI chat for general travel queries** (NEW)

### Backend

- ✅ Express.js REST API
- ✅ JWT authentication
- ✅ Mongoose schema with relationships
- ✅ Server-side validation
- ✅ Overlap detection for activities
- ✅ Cascading delete (trip deletes days and activities)
- ✅ Activity reordering and moving
- ✅ Collaborator endpoint
- ✅ **AI intent detection and natural language processing** (NEW)
- ✅ **Multi-source image fetching (Unsplash/Pixabay)** (NEW)
- ✅ **Result caching for performance optimization** (NEW)

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
# UNSPLASH_KEY=<optional-unsplash-api-key>  # For better destination images
# PIXABAY_KEY=<optional-pixabay-api-key>    # For image fallback
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
3. **Plan Activities**:
   - Add activities manually with time, cost, and other details
   - **Use AI Assistant**: Type natural language like "Add a museum visit on Day 2 at 3 PM" to create activities instantly
4. **Track Budget**: Monitor daily and trip-wide spending
5. **Share Trips**: Invite collaborators via email
6. **View Analytics**: Check statistics and destination images on the dashboard
7. **Manage Schedule**: Use timeline view to optimize your schedule
8. **Get Travel Advice**: Click the 🤖 button in the navbar to ask general travel questions (packing, destination tips, etc.)

## 🤖 AI Assistant Features

### Trip-Specific Queries (when viewing a trip)

```
"Add a cafe visit on day 2"
"Suggest activities for day 1"
"Reduce cost for this trip"
"Is my trip too packed?"
```

### General Travel Queries (from navbar)

```
"What should I pack for a beach vacation?"
"Things to do in Paris"
"Budget tips for traveling"
"Best time to visit Japan"
```

The AI automatically:

- Detects the day number from your message
- Extracts activity details (title, time if mentioned)
- Creates activities with smart defaults
- Provides friendly feedback and recommendations

## 🛠️ Tech Stack

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- CORS enabled
- **Unsplash & Pixabay APIs for image fetching** (NEW)
- **Regex-based NLP for intent detection** (NEW)

**Frontend**

- React 18
- React Router v6
- Axios for API calls
- CSS-in-JS styling
- **AI Chat Interface** (NEW)

## 📄 License

This project is open source and available under the MIT License.
