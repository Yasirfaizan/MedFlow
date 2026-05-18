# MedFlow — AI Clinic Management SaaS

## Live Demo

[https://medflow.vercel.app](https://medflow.vercel.app)

## Tech Stack

- MongoDB, Express.js, React.js, Node.js
- JWT Auth, Role-Based Access Control
- Tailwind CSS, Lucide React, Recharts
- Gemini AI API, PDFKit

## Roles

admin | doctor | receptionist | patient

## Setup

### Backend

cd server
npm install
cp .env.example .env # fill in your values
npm run dev

### Frontend

cd client
npm install
npm run dev

## Environment Variables

PORT, MONGO_URI, JWT_SECRET, CLIENT_URL,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
GEMINI_API_KEY

## Features

- 4 role dashboards
- Patient management with history timeline
- Appointment booking with slot conflict detection
- Dynamic prescription with PDF export
- AI symptom checker, prescription explainer, risk flags
- Predictive analytics (Pro plan)
- SaaS subscription gating (Free / Pro)
