# Full Stack Food Ordering Web Application

## Quick Setup Guide

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL Server

### 2. Backend Setup
The backend consists of Spring Boot microservices.

**Step 2.1: Eureka Server (Service Registry)**
```bash
cd backend/eureka-server
mvn spring-boot:run
```

**Step 2.2: API Gateway**
```bash
cd backend/api-gateway
mvn spring-boot:run
```

**Step 2.3: User Service**
(Make sure MySQL is running and accessible at `localhost:3306`, create database `foodapp_users`)
```bash
cd backend/user-service
mvn spring-boot:run
```

### 3. Frontend Setup
The frontend is a ReactJS app using Vite, TailwindCSS, and Framer Motion.

```bash
cd frontend
npm install
npm run dev
```

### API Endpoints
- API Gateway acts as the entry point at `http://localhost:8080`
- Eureka Server runs at `http://localhost:8761`
- `POST http://localhost:8080/api/auth/login` (Routed to User Service)
- `POST http://localhost:8080/api/auth/signup` (Routed to User Service)

*Note: The actual source files containing these implementations have been generated as snippets in the adjacent folders to serve as a starting template.*
"# FoodApp_Microservices" 
