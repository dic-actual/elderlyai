import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Activity, Thermometer, Shield, AlertTriangle, Heart, User, FileText, X } from 'lucide-react';

// TODO: Replace with your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBaDHw3wz8RziooZP3jXrucTXylLraAYz8",
  authDomain: "elderlyai-hackathon.firebaseapp.com",
  databaseURL: "https://elderlyai-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "elderlyai-hackathon",
  storageBucket: "elderlyai-hackathon.firebasestorage.app",
  messagingSenderId: "66215058234",
  appId: "1:66215058234:web:b4f7714b9fff3446d18e03",
  measurementId: "G-D7E7J03ZH9"
};

// Initialize Firebase
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (e) {
  console.error("Firebase Init Error:", e);
}

function App() {
  const [userData, setUserData] = useState({
    status: 'SAFE',
    temp: 24.5,
    battery: 100,
    ai_message: "System Initializing...",
    lastUpdate: Date.now() / 1000
  });
  const [showMedicalModal, setShowMedicalModal] = useState(false);

  useEffect(() => {
    if (!db) return;
    const userRef = ref(db, 'users/senior_1');
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserData(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const isCritical = userData.status === 'FALL' || userData.status === 'HEAT';
  const statusColor = isCritical ? 'text-neon-red' : 'text-neon-green';
  const borderColor = isCritical ? 'neon-border-red' : 'neon-border-green';
  const statusText = userData.status === 'SAFE' ? 'SYSTEM NORMAL' : `CRITICAL ALERT: ${userData.status}`;

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8 flex flex-col items-center">

      {/* HEADER */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Shield className={`w-8 h-8 ${statusColor}`} />
          <h1 className="text-2xl font-bold tracking-widest text-white">PASSIVE<span className={statusColor}>SHIELD</span></h1>
        </div>
        <div className="text-xs text-gray-500 font-mono text-right">
          ID: SENIOR_1 <br />
          LINK: SECURE
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* STATUS CARD */}
        <div className={`glass-panel p-6 rounded-xl border ${isCritical ? 'border-neon-red' : 'border-gray-800'} relative overflow-hidden transition-all duration-500`}>
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Activity size={100} className={isCritical ? 'text-red-500 animate-pulse-fast' : 'text-green-500'} />
          </div>

          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Current Status</h2>
          <div className={`text-4xl font-bold mb-4 ${statusColor} ${isCritical ? 'animate-pulse' : ''}`}>
            {statusText}
          </div>

          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2 bg-panel-bg p-3 rounded-lg border border-gray-700 w-1/2">
              <Thermometer className="text-neon-yellow" />
              <div>
                <div className="text-xs text-gray-500">TEMP</div>
                <div className="text-xl font-mono">{userData.temp}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-panel-bg p-3 rounded-lg border border-gray-700 w-1/2">
              <Activity className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">HEART RATE</div>
                <div className="text-xl font-mono">72 BPM</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI INSIGHT CARD */}
        <div className="glass-panel p-6 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h2 className="text-blue-400 font-mono text-sm">AI GUARDIAN NODE</h2>
          </div>

          <div className="flex-grow font-mono text-sm leading-relaxed text-gray-300">
            {userData.ai_message ? (
              <p className="typing-effect">{userData.ai_message}</p>
            ) : (
              <p className="text-gray-600 italic">Analyzing sensor patterns...</p>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-600 text-right">
            Last Update: {new Date(userData.lastUpdate * 1000).toLocaleTimeString()}
          </div>
        </div>

        {/* MEDICAL INFO BUTTON */}
        <div className="md:col-span-2">
          <button
            onClick={() => setShowMedicalModal(true)}
            className="w-full bg-panel-bg border border-gray-700 hover:border-neon-green hover:text-neon-green text-gray-400 p-4 rounded-xl transition-all flex items-center justify-center gap-3 group"
          >
            <User className="group-hover:scale-110 transition-transform" />
            <span className="font-mono tracking-widest">ACCESS MEDICAL RECORDS (QR SCAN)</span>
          </button>
        </div>

      </div>

      {/* MEDICAL MODAL */}
      {showMedicalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-panel-bg border border-neon-green p-8 rounded-xl max-w-md w-full relative shadow-[0_0_30px_rgba(57,255,20,0.2)]">
            <button
              onClick={() => setShowMedicalModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X />
            </button>

            <div className="flex items-center gap-3 mb-6 text-neon-green">
              <FileText />
              <h2 className="text-xl font-bold tracking-widest">MEDICAL PROFILE</h2>
            </div>

            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">NAME</span>
                <span className="text-white">JANE DOE (78)</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">BLOOD TYPE</span>
                <span className="text-neon-red font-bold">O+</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">ALLERGIES</span>
                <span className="text-white">PENICILLIN, PEANUTS</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">MEDICATION</span>
                <span className="text-white">LISINOPRIL (10mg)</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-500">CONTACT</span>
                <span className="text-white">+1 (555) 019-2834</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-red-900/20 border border-red-900 rounded text-xs text-red-400 text-center">
              EMERGENCY USE ONLY
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
