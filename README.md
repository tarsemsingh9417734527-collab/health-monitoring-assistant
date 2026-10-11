# 🏥 Smart Health Assistant Platform

## Track B – Advanced Health-Tech Project

An AI-powered Smart Health Assistant that helps users manage medications, record health measurements, ask health-related questions, and view health insights through a patient-friendly dashboard.

---

## 👨‍💻 Project Information

**Project:** Smart Health Assistant Platform  
**Track:** Track B – Advanced  
**Domain:** Smart Healthcare  
**AI Framework:** LangChain  
**AI Model:** Google Gemini  
**Backend:** FastAPI  
**Frontend:** React + Vite  
**Database:** SQLite  
**Deployment:** Render  

---

# 🎯 Project Objective

The objective of this project is to develop an intelligent health assistant that combines Artificial Intelligence, health data management, medication tracking, external APIs, analytics, and a patient-friendly web interface.

The system allows users to interact with their health information using natural language.

---

# 🚀 Main Features

### 🤖 AI Health Assistant
Users can ask health-related questions using natural language through the Gemini-powered AI assistant.

### 💊 Medication Management
Users can add and manage medications using natural language.

Example:

> Add Vitamin D, 1 tablet, every day at 9 AM.

### 📝 Medication Dose Tracking
Users can record when they take their medication.

Example:

> I took my Vitamin D today.

### ❤️ Health Metrics
Users can record:
- Blood pressure
- Blood sugar
- Heart rate
- Temperature
- Weight

### 📊 Health Analytics
The dashboard displays:
- Active medications
- Recorded doses
- Health measurements
- Recent health records

### 💡 Health Insights
The system generates basic insights from stored health information.

### 🎤 Voice Health Queries
Users can use voice input to ask health-related questions.

### 🌐 External API Integrations
The project includes integrations for:
- Health information
- Weather
- Air quality

---

# 🏗️ System Architecture

```text
                         User
                          │
                          ▼
                  React Frontend
                          │
                          ▼
                    FastAPI Backend
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
           Gemini      LangChain   External APIs
              │           │           │
              └───────────┼───────────┘
                          │
                          ▼
                       SQLite
                       Database
                          │
                          ▼
                  Analytics & Insights