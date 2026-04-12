<<<<<<< HEAD
# Smart Campus Operations Hub Documentation

## Project Overview
This document provides details about the Smart Campus Operations Hub project, its purpose, and features.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Infrastructure:** Docker, AWS

## Core Modules
1. User Management
2. Campus Facilities
3. Real-time Notifications
4. Analytics Dashboard

## API Endpoints
| Endpoint                  | Method | Description            |
|--------------------------|--------|------------------------|
| /api/users               | GET    | Retrieve user details   |
| /api/facilities          | POST   | Add new facility        |
| /api/notifications       | GET    | Get notifications       |
| /api/analytics           | GET    | Get analytics data     |

## Project Structure
```
/ 
├── client/                # Frontend
├── server/                # Backend
├── docs/                  # Documentation
└── tests/                 # Tests
```

## Setup Instructions
1. Clone the repository.
2. Navigate to the server directory: `cd server`
3. Install dependencies: `npm install`
4. Set up environment variables as described below.
5. Start the server: `npm start`

## Environment Variables
- `NODE_ENV`: production or development
- `PORT`: The port the server will run on
- Database connection URI

## Testing
Run tests with the command: `npm test`

## Git Workflow
1. Branch off from the main branch for features.
2. Open a pull request for review.
3. Merge changes into main after approval.

## CI/CD
Utilize GitHub Actions for automated testing and deployment on merging to main.

## Innovation Features
- Integration with IoT devices for real-time data.
- Advanced analytics for facility usage.

## Team Contributions
- **John Doe**: Lead Developer
- **Jane Smith**: Frontend Developer
- **Emily Johnson**: Backend Developer

## Documentation
Refer to the /docs directory for additional documentation.

## Academic Integrity
This project maintains a commitment to academic integrity by ensuring all work is original and properly attributed.

## Conclusion
The Smart Campus Operations Hub is a comprehensive solution for enhancing campus life through modern technology. Continuous updates and community feedback will drive future improvements.
=======
# IT3030 PAF 2026 - Smart Campus Operations Hub

Spring Boot REST API + React web application for smart campus resource bookings, incident ticketing, and notifications.

## Tech Stack

- Backend: Java 17, Spring Boot, MongoDB
- Frontend: React (Vite)
- CI: GitHub Actions

## Implemented Modules

### Module A - Facilities & Assets Catalogue
- Resource CRUD endpoints (`/api/resources`)
- Resource metadata: type, capacity, location, availability window, status
- Resource filter support (`type`, `minCapacity`, `location`, `status`)

### Module B - Booking Management
- Booking CRUD workflow endpoints (`/api/bookings`)
- Workflow states: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
- Conflict detection for overlapping bookings on same resource/time slot
- Booking filters by user and status

### Module C - Maintenance & Incident Ticketing
- Ticket endpoints (`/api/tickets`)
- Workflow states: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REJECTED`
- Assignment to technician
- Attachments (max 3 string paths/URLs)
- Ticket comments with ownership rules (owner or admin can edit/delete)

### Module D - Notifications
- Notification endpoints (`/api/notifications`)
- Notifications generated for booking updates and ticket updates/comments

## Project Structure

- `src/main/java/com/sliit/bookingmodule` - Spring Boot backend
- `frontend` - React client app
- `.github/workflows/ci.yml` - CI build workflow

## Prerequisites

- Java 17+
- Node.js 22+
- MongoDB Atlas (or local MongoDB)

## Run Backend

1. Configure MongoDB URI in `src/main/resources/application.properties`
2. Start backend:

```bash
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.
API calls are proxied from `/api` to backend `http://127.0.0.1:8080`.

## Key Endpoints

- `GET/POST/PUT/PATCH/DELETE /api/resources`
- `GET/POST/PATCH /api/bookings`
- `GET/POST/PATCH/DELETE /api/tickets`
- `GET/PATCH /api/notifications`

## Notes

- OAuth 2.0 and advanced role-based security are not yet fully integrated.
- Current authorization checks are minimal and should be upgraded before final viva.
>>>>>>> 7f6075b (Add booking enhancements, ticket/resource modules, and frontend apps)
