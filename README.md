# 🌿 CalmCure - Full-Stack Mental Wellness Platform

CalmCure is an immersive mental wellness application designed to help users track their emotional well-being, reflect through journaling, and practice mindfulness in a secure, distraction-free environment.

## 🌟 Key Features

-   **🔐 Authentication & Security**: Secure user accounts with JWT-based session management and Bcrypt password hashing.
-   **🧠 Mood Tracking**: Log daily moods with intensity levels and personal notes.
-   **📈 Visual Progress**: Interactive analytics dashboard using **Chart.js** to visualize emotional trends over a 30-day period.
-   **📖 Digital Sanctuary (Journaling)**: A private space to write thoughts, featuring lightweight AI reflections to promote self-awareness.
-   **🧘 Mindfulness Tools**: 
    -   **Calm Mode**: An immersive breathing visualizer with ambient beach sounds and affirmations.
    -   **Relaxation Hub**: Curated resources including music playlists and light reading.
-   **🚨 SOS Support**: Quick-access emergency contact button for immediate assistance.

## 🛠️ Technical Architecture

### Frontend (Vanilla Excellence)
-   **Language**: HTML5, CSS3, JavaScript (ES6+).
-   **UI Design**: Custom-built Glassmorphism design system for a premium, soothing feel.
-   **State Management**: Secure handling of JWT tokens in LocalStorage with global route protection.

### Backend (Robust API)
-   **Framework**: Node.js & Express.js.
-   **Database**: PostgreSQL for structured, persistent data storage.
-   **Dependencies**: `pg` (Database), `jsonwebtoken` (Auth), `bcryptjs` (Security), `cors` (Cross-Origin Resource Sharing).

## 🚀 Getting Started

### 1. Database Setup
Ensure you have **PostgreSQL** installed. Create a database named `calmcure` and initialize the schema:
```bash
# Run the migration script located in the backend folder
node backend/scripts/migrate.js
```

### 2. Backend Configuration
Navigate to the `backend/` directory and install the required packages:
```bash
cd backend
npm install express pg jsonwebtoken bcryptjs cors dotenv
```
Create a `.env` file in the `backend/` root with your DB credentials and a `JWT_SECRET`.

### 3. Running the Application
Start both servers simultaneously in separate terminals:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd calmcure
npx serve .
```

Visit `http://localhost:3000` to start your journey. 🌿
