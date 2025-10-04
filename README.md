# Live Polling System

A real-time, interactive web application designed for educational and interactive sessions, allowing teachers to create and manage live polls and students to submit their votes instantly.

-----

## 🚀 Live Demo

Experience the application live:
[https://live-poll-frontend-62zb.onrender.com/](https://live-poll-frontend-62zb.onrender.com/)

-----

## ✨ Features

The Live Polling System supports two distinct user roles:

### 🧑‍🏫 Teacher Features

  * **Real-time Polling:** Create and launch new poll questions instantly.
  * **Customizable Polls:** Set a custom question, up to four answer options, and a time limit (e.g., 60 seconds).
  * **Live Results:** Monitor **votes** and **percentages** for the active poll in real-time.
  * **Session Management:** Start and **End Poll** sessions.
  * **Participant Tracking:** View the list of active participants (students) in the current session.
  * **Poll History:** Access a history of past polls.

### 🧑‍💻 Student Features

  * **Real-time Participation:** Join a live poll session and submit answers instantly.
  * **Waiting Screen:** A dedicated waiting screen is shown until the teacher initiates a poll.
  * **Vote Confirmation:** Receive confirmation once a vote has been successfully submitted.

-----

## 🛠️ Tech Stack

This project is a full-stack application leveraging the following technologies:

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | JavaScript (with a framework like React or Vue) | Building the user interface for both Teacher and Student dashboards. |
| **Backend** | Node.js / Express | Server-side logic, API handling, and serving real-time updates. |
| **Real-time** | **Socket.IO / WebSockets** | Enabling instant, bi-directional communication for live polling and result updates. |
| **Database** | MongoDB / PostgreSQL (Inferred) | Storing poll questions, options, session data, and poll history. |

-----

## 💻 Local Setup and Installation

Follow these steps to set up the project locally.

### Prerequisites

  * **Node.js** (v14+)
  * **npm** or **yarn**
  * A running instance of your chosen database (e.g., MongoDB)

### 1\. Clone the repository

```bash
git clone https://github.com/TusharVaishnaw/live-polling-sytem.git
cd live-polling-sytem
```

### 2\. Backend Setup

The project structure suggests a separate `backend` folder.

```bash
cd backend
npm install
# Create a .env file and add your database and port configurations
# Example: DB_URI=your_database_connection_string
# Example: PORT=5000
npm start
```

The backend server should now be running on the specified port.

### 3\. Frontend Setup

The project structure suggests a separate `frontend` folder.

```bash
cd ../frontend
npm install
# Ensure the API endpoint in the frontend configuration
# points to your running backend (e.g., http://localhost:5000)
npm start
```

The frontend application should now be running (typically at `http://localhost:3000`).

Open your browser and navigate to the local frontend address to start using the **Live Polling System**.
