 Mini CRM Platform

This project is a Mini CRM Platform built for the Xeno SDE Internship Assignment 2025.
It provides customer data ingestion, campaign creation, delivery logging, authentication, and AI-powered features.

** Features
🔹 Data Ingestion

Upload customers and orders datasets (CSV/Excel).

Implemented via:

uploadController.js (backend).

UploadFile.js (frontend React component).

Data validated at API layer, persisted to MongoDB.

🔹 Campaign Creation

Users can define audience segments with rules (spend, visits, inactivity, etc.).

Dynamic rule builder (CreateSegment.js).

Preview audience size before saving.

Campaigns saved and shown in Campaign History (CampaignHistory.js).

🔹 Campaign Delivery & Logging

Campaigns stored in campaign model.

campaignController.js + deliverController.js handle:

Creating new campaign entries.

Simulated message delivery (90% success, 10% failure).

Updating communication log via Delivery Receipt API.

Dummy Vendor API implemented in Routers/vendor.js.

🔹 Authentication

Implemented Google OAuth 2.0 (authController.js, auth.js router).

Middleware protect.js ensures only logged-in users access campaign features.

Frontend: Login.js page integrates with Google sign-in.

🔹 AI Integration

AI-powered message suggestions for campaigns.

Backend integrates OpenAI API (see environment config).

Flow:

User defines campaign goal.

System suggests 2–3 message variants.

User selects one to launch.

🛠 Tech Stack

Frontend: React.js, Tailwind CSS, Zustand (state)

Backend: Node.js (Express)

Database: MongoDB

Auth: Google OAuth 2.0 (Passport.js)

AI: OpenAI GPT API

Other: Axios, Postman for testing

🏗 Architecture
Frontend (React + Zustand) ----> Backend (Express APIs) ----> MongoDB
       |                                |                       |
   Google OAuth                   Campaign APIs            Data storage
       |                                |
   Campaign UI ----> AI Message Suggestions ----> OpenAI API


Consumer logic (lib/consumer.js) handles async updates (pub-sub simulation).

Vendor API simulates external SMS/Email provider.

⚙️ Setup Instructions
1. Clone repository
git clone https://github.com/your-username/CRM-App.git
cd CRM-App

2. Backend setup
cd Backend
npm install
cp .env.example .env   # add your credentials
npm start


Backend runs on: http://localhost:5000

3. Frontend setup
cd Frontend
npm install
npm start


Frontend runs on: http://localhost:3000

🔑 Environment Variables

Backend .env:

PORT=5000
MONGO_URI=your_mongo_connection_string
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
OPENAI_API_KEY=your_openai_api_key

📡 API Endpoints
Upload

POST /upload/customers → Upload customers file

POST /upload/orders → Upload orders file

Campaign

POST /campaign/create → Create campaign

GET /campaign/history → Fetch past campaigns

Vendor Simulation

POST /vendor/send → Send messages (simulated)

POST /delivery/receipt → Update delivery log

Auth

GET /auth/google → Login with Google

GET /auth/google/callback → OAuth callback

🧠 AI Integration Details

Feature: Campaign Message Generator

Tool: OpenAI GPT API

Purpose: Generate 2–3 personalized message templates per campaign.

Example:

Input: "Bring back inactive users"
Output:
1. "Hi [Name], we miss you! Get 20% off on your next order."
2. "Hello [Name], come back today and unlock free shipping!"

📜 Known Limitations

Pub-sub is simulated (not Kafka/RabbitMQ).

Vendor API is mocked (no real SMS/email delivery).

Campaign analytics basic (sent/failed only).

Requires valid OpenAI API Key for AI features.
