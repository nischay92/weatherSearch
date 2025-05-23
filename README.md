# 🌦️ Zephyros Weather App

A full-stack responsive weather application built using React and Node.js, featuring interactive weather forecasts, location-based search with fuzzy matching, and map integration. Created as part of the **Product Manager Accelerator** program.

---

## 🚀 Features

### 🔸 Frontend (React + Vite + MUI)
- Responsive UI for desktop, tablet, and mobile
- Search by city, ZIP, landmark, or coordinates
- Date range selection with validation (incl. start < end check)
- Google Maps marker preview using `@react-google-maps/api`
- Live weather + forecast from OpenWeatherMap API
- Weather history saved and listed with edit/delete options
- Export data as CSV or JSON
- Sticky “About this App” footer with PMA details

### 🔸 Backend (Node.js + Express + MongoDB)
- RESTful API for fetching, saving, editing, deleting weather entries
- Fuzzy location matching via Nominatim (OpenStreetMap)
- CRUD operations for weather data stored in MongoDB Atlas
- Weather data fetched from OpenWeatherMap based on coordinates
- Input validation and error handling throughout

---

## 🧪 Tech Assessment Coverage

### ✅ Tech Assessment #1 – Frontend
- Fully responsive UI using MUI components and responsive `sx` props
- Handles multiple APIs: Nominatim, OpenWeatherMap, Google Maps
- Implements custom input validation, field-level feedback, and alert banners

### ✅ Tech Assessment #2 – Backend
- Designed and implemented RESTful APIs
- Integrated MongoDB Atlas with full CRUD operations
- Used Nominatim for fuzzy search geocoding (e.g., partial city names work)
- Clear error handling with fallback messaging to frontend


---

## 🧰 Tech Stack

- Frontend: React, Vite, Material UI, Axios, Socket.IO (optional)
- Backend: Node.js, Express.js
- Database: MongoDB (hosted on Atlas)
- External APIs:
  - OpenWeatherMap (weather & forecast)
  - Nominatim (location geocoding with fuzzy matching)
  - Google Maps (visual map preview)

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites
- Node.js v18+
- MongoDB Atlas URI
- OpenWeatherMap API Key
- Google Maps API Key

### 📦 Install & Run Locally

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
cd backend
npm install
# create .env file with:
# MONGO_URI=<your-mongodb-uri>
# OPENWEATHER_API_KEY=<your-api-key>
npm run dev
cd ../frontend
npm install
# create .env file with:
# VITE_GOOGLE_MAPS_API_KEY=<your-api-key>
# VITE_API_BASE=http://localhost:5000
npm run dev
```

