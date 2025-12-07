# 🛡️ ElderlyAI: The Passive Guardian

### Protecting the "Unconnected" with Passive Sensing & Generative AI.

---

## 📖 The Story: Solving the "Long Lie"
By 2040, Japan alone faces a shortage of **690,000 caregivers**. The global elderly population is exploding, yet modern tech creates friction—seniors often forget to charge smartwatches or refuse to wear intrusive wearables.

This leads to the **"Long Lie"**: when a senior falls and remains on the floor for hours because they couldn't call for help.

**ElderlyAI** solves this with **Zero-UI Passive Sensing**. We transform potential falls into instant alerts using environmental sensors and interpret well-being with Generative AI, ensuring safety without dignity-compromising surveillance.

---

## ⚡ The Tech Stack

### 1. Edge: Zero-UI Sensor Node
- **Simulation**: Smartphone Accelerometer / Gyroscope (HTML5 DeviceMotion).
- **Hardware Goal**: ESP32 Micro-controllers placed discreetly in the home.
- **Function**: Detects sudden G-force impacts (Falls) and environmental anomalies (Heatstroke) without user interaction.

### 2. Core: Firebase Realtime Database
- **Performance**: Sub-200ms latency for critical state synchronization.
- **Architecture**: Event-driven architecture connecting Client A (Sensor) to Client B (Dashboard) instantly.

### 3. Brain: ElderlyAI Cloud Functions
- **Logic**: Serverless computing to validate fall patterns (Impact + Stillness).
- **Generative AI**: Uses LLMs to generate empathetic daily health summaries and "Guardian" status messages for caregivers, reducing alarm fatigue.

---

## 🚀 Live Demos

| Component | Status | Link |
|-----------|--------|------|
| **Caregiver Dashboard** | 🟢 Live | [Insert Vercel Dashboard Link Here] |
| **Virtual Sensor** | 🟢 Live | [Insert Vercel Sensor Link Here] |

---

## 🛠️ Local Installation

### Prerequisites
- Node.js & npm/yarn
- Firebase Project Credentials

### 1. Clone & Setup
```bash
git clone https://github.com/your-username/elderly-ai.git
cd elderly-ai
```

### 2. Run Dashboard (Client)
```bash
cd dashboard
npm install
npm run dev
```

### 3. Run Virtual Sensor
Open `dashboard/public/sensor.html` in your mobile browser or host it via the dashboard's public folder.

---

## 🏆 Hackathon MVP Features
- **Real-time Fall Detection**: < 1 second alert propagation.
- **Heatstroke Prevention**: Monitoring ambient temperature thresholds.
- **Medical ID Integration**: QR Code access for paramedics.
- **AI Insight Node**: "Wizard of Oz" simulation of Generative AI logic.

---

> Built with ❤️ for the future of AgeTech.
