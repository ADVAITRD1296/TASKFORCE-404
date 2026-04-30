# BOOKZY — All-in-One Booking Platform

> Book flights, trains, buses, hotels, and entertainment — all in one premium platform.

Built by **Taskforce 404** at IIIT Lucknow.

## Project Structure

```
TASKFORCE-404/
├── frontend/          ← React + Vite (UI)
│   ├── src/
│   │   ├── components/   (Navbar, Footer, ChatWindow, AuthModal)
│   │   ├── pages/        (Home, Shows, Hotels, Flights, Trains, Buses, Offers, AboutUs)
│   │   ├── context/      (AuthContext)
│   │   ├── services/     (API client)
│   │   ├── styles/       (CSS files)
│   │   └── assets/       (Images)
│   ├── package.json
│   └── vite.config.js
│
├── backend/           ← Spring Boot (Java 17)
│   ├── src/main/java/com/taskforce/backend/
│   │   ├── controller/   (REST APIs)
│   │   ├── service/      (Business logic)
│   │   ├── entity/       (JPA entities)
│   │   ├── repository/   (Data access)
│   │   ├── config/       (Security, JWT, WebSocket)
│   │   └── dto/          (Data transfer objects)
│   ├── pom.xml
│   └── application.properties
│
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app runs at **http://localhost:5173**

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot API runs at **http://localhost:8080**

> **Note:** Make sure MySQL is running locally with a database named `bookzy_db` before starting the backend.

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 19, Vite, React Bootstrap, React Router |
| Backend  | Spring Boot 3, Spring Security, JPA, JWT      |
| Database | MySQL                                         |
| Features | WebSocket Chat, Twilio WhatsApp, Firebase      |

## Team

Led by **Advait Deshpande** with contributions from Ranveer, Pruthviraj, Ayan, Arijeet, Ketan, Krrish, Suryansh, Piyush, and Rishab.
