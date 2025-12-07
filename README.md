# 🛡️ ElderlyAI: The Autonomous Guardian

> **Winner/Participant of [Hackathon Name]**
> *Protecting the "Unconnected" with Passive Sensing & Generative AI.*

[![Live Demo]((https://dashboard-a4tjts8ft-dickyactuals-projects.vercel.app/))]
[![Mobile Sensor](https://dashboard-a4tjts8ft-dickyactuals-projects.vercel.app/sensor.html)]

## 🚨 The Problem
Japan faces a shortage of 690,000 caregivers by 2040. Millions of elderly people live alone (*dokkyo rojin*) and cannot use complex interfaces like Apple Watches. When they fall or suffer heatstroke, they often cannot call for help.

## 💡 The Solution
**ElderlyAI** is a Zero-UI monitoring system that transforms passive sensors into an active agent.
1.  **Passive Sensing:** Detects falls and **Heat Index** risks (Temp + Humidity) without user interaction.
2.  **Generative AI Narrator:** Uses **Google Vertex AI (Gemini 1.5)** to turn raw telemetry into a reassuring "Daily Digest" for families.
3.  **Autonomous Agent:** In emergencies, the system simulates downstream actions (calling EMS, unlocking smart doors) based on context.

## 🛠️ Tech Stack
* **Edge:** Virtual IoT Node (Smartphone IMU + Environmental Simulation)
* **Core:** Firebase Realtime Database (Sub-200ms latency)
* **AI Logic:** Google Vertex AI for Firebase (Gemini 1.5 Flash)
* **Frontend:** React + Tailwind CSS (Bilingual EN/JP Support)
* **Design:** Premium Dark Mode (Medical Aesthetic)

## 🚀 Key Features
* **🇯🇵 Native Bilingual:** Fully localized UI and AI responses (Keigo/Polite Japanese).
* **🌡️ Heatstroke Protection:** Calculates Heat Index to detect dangerous indoor humidity levels.
* **🧠 Contextual Analysis:** Filters false alarms by analyzing pre-fall motion patterns.
* **🏥 EMS Handoff:** "Paramedic-Ready" medical profile with DNAR and Insurance data.

## 📦 How to Run
1.  Clone the repo
2.  `npm install`
3.  `npm run dev`
4.  Open `sensor.html` on a mobile device to act as the IoT node.

---
*Built for Actual Hackathon 2025 by Yuna & Dicky*
