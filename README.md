# SafeCircle-Personal-Emergency-Response-Platform

> **A secure emergency assistance platform that enables users to manage emergency contacts, medical information, emergency QR profiles.**

---

# 📖 Overview

SafeCircle is a full-stack emergency assistance platform designed to help users prepare for emergency situations by securely storing emergency contacts, medical information, and emergency profiles.

The platform also includes an Emergency QR system that allows a stranger or first responder to access essential emergency information through a secure public webpage without requiring the SafeCircle application.

---

# 🚨 Problem Statement

During emergencies, people often struggle to:

- Contact family members quickly
- Share important medical information
- Receive immediate guidance
- Allow strangers to help safely
- Access emergency information without unlocking the phone

Existing emergency applications generally focus only on sending SOS messages and do not provide a complete emergency ecosystem.

SafeCircle addresses these challenges by combining emergency profile management, QR-based assistance, and secure backend services into one platform.

---

# ✨ Features

## 👤 User Authentication

- Secure Registration
- Secure Login
- JWT Authentication
- Password Encryption
- Role-Based Authorization

---

## 📞 Emergency Contact Management

Users can

- Add emergency contacts
- View contacts
- Update contacts
- Delete contacts

---

## 🏥 Medical Profile

Users can securely maintain:

- Blood Group
- Allergies
- Medical Conditions
- Current Medications
- Emergency Notes

---

## 🔳 Emergency QR Profile

Each user receives a unique Emergency QR.

When scanned:

- Opens a public emergency webpage
- Displays emergency medical details
- Shows emergency contacts
- Does not require the SafeCircle application
- Protects private account information using secure public tokens


---

## 📊 Dashboard

The dashboard provides centralized access to:

- Emergency Profile
- Medical Information
- Emergency Contacts
- QR Profile

---

## 📍 Location Sharing (REST API)
- Real-time GPS coordinate logging and retrieval via secure REST endpoints.
- Secure sharing of location with trusted family members.

---

## 📱 SMS & Email Alerts
- Twilio integration for dispatching SMS alerts.
- JavaMailSender implementation for email verification links.

---

# 🏗️ Project Architecture

```
                 React Frontend
                        │
                        │ REST APIs
                        ▼
              Spring Boot Backend
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   Controllers      Security        Services
                        │
                     JWT Auth
                        │
                  Repository Layer
                        │
                     Hibernate
                        │
                      PostgresSQL
```

---

# 🛠️ Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT Authentication
- REST APIs
- Twilio(SMS Alerts)
- JavaMailSender(Email verification links)

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Database

- PostgresSQL

## Development Tools

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

---


# ⚙️ Installation

## Backend

Clone the repository

```bash
git clone https://github.com/your-username/SafeCircle.git
```

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
mvn clean install
```

Run the application

```bash
mvn spring-boot:run
```

---

## Frontend

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the project

```bash
npm run dev
```

---

# 🗄️ Database Configuration

Configure your MySQL database in

```
application.properties
```

Example

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/safe_circle

spring.datasource.username=root

spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update

spring.jpa.show-sql=true
```

---

# 🔐 Environment Variables

Configure your JWT secret.

```properties
jwt.secretKey=YOUR_SECRET_KEY
```

If AI integration is added later, include:

```properties
OPENAI_API_KEY=YOUR_API_KEY
```

or

```properties
GEMINI_API_KEY=YOUR_API_KEY
```

---


# 👨‍💻 Author

**Palak Singla**

---

# ⭐ Support

If you found this project useful,

⭐ Star the repository

🍴 Fork the repository

📢 Share your feedback

Contributions are welcome!
