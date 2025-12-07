import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAI, getGenerativeModel } from "firebase/ai";
import { Activity, Thermometer, Shield, ShieldAlert, AlertTriangle, User, FileText, X, Brain, Phone, Lock, CheckCircle, Loader, Globe, AlertOctagon, Ambulance, Stethoscope, Star, Wind, Wifi, ThermometerSun, Link as LinkIcon, Database } from 'lucide-react';

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
let app, db, vertexAI, model;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  // Initialize Vertex AI
  vertexAI = getAI(app);
  model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });
} catch (e) {
  console.error("Firebase Init Error:", e);
}

// Translations Dictionary for UI Labels
const translations = {
  en: {
    // Header
    title: "ELDERLYAI",
    id_label: "ID: SENIOR_1",
    link_label: "LINK: SECURE",
    // Dashboard
    status_label: "CURRENT STATUS",
    status_safe: "PASSIVE MONITORING ACTIVE",
    status_fall: "CRITICAL ALERT: FALL",
    status_heat: "CRITICAL ALERT: HEATSTROKE",
    temp_label: "TEMP / INDEX",
    hr_label: "HEART RATE",
    // AI Card
    ai_title: "AI GUARDIAN INSIGHTS",
    ai_placeholder: "System active. Monitoring daily routine.",
    btn_generate: "GENERATE DAILY REPORT",
    btn_loading: "RETRIEVING 24H TELEMETRY...",
    last_update: "Updated:",
    agent_active: "Autonomous Protocol Active",
    // Footer
    btn_medical: "ACCESS MEDICAL RECORDS (QR SCAN)",
    med_title: "EMERGENCY PROFILE",
    emergency_only: "EMERGENCY USE ONLY",
    // Medical Modal Labels
    lbl_blood: "Blood Type",
    lbl_age: "Age",
    lbl_dnar: "DNAR Status",
    lbl_allergies: "Allergies",
    lbl_history: "Medical History",
    lbl_implants: "Medical Implants",
    lbl_insurance: "Insurance ID",
    lbl_doctor: "Primary Physician",
    lbl_clinic: "Clinic"
  },
  ja: {
    // Header
    title: "ELDERLYAI",
    id_label: "ID: シニア_1",
    link_label: "通信: 暗号化済み",
    // Dashboard
    status_label: "現在のステータス",
    status_safe: "見守りモニタリング中",
    status_fall: "緊急警報：転倒検知",
    status_heat: "緊急警報：熱中症リスク",
    temp_label: "室温 / 不快指数",
    hr_label: "心拍数",
    // AI Card
    ai_title: "AI見守りインサイト",
    ai_placeholder: "システム正常。日常動作をモニタリング中。",
    btn_generate: "日次レポート生成",
    btn_loading: "24時間データを取得中...",
    last_update: "最終更新:",
    agent_active: "自律プロトコル実行中",
    // Footer
    btn_medical: "救急用医療データ (QRスキャン)",
    med_title: "救急医療プロフィール",
    emergency_only: "救急隊員専用",
    // Medical Modal Labels
    lbl_blood: "血液型",
    lbl_age: "年齢",
    lbl_dnar: "蘇生措置 (DNAR)",
    lbl_allergies: "アレルギー",
    lbl_history: "既往歴",
    lbl_implants: "埋込機器",
    lbl_insurance: "保険証番号",
    lbl_doctor: "主治医",
    lbl_clinic: "クリニック"
  }
};

// Mock Patient Data (Bilingual)
const MEDICAL_DATA = {
  en: {
    name: "Jane Doe",
    age: "78",
    blood: "O+",
    dnar: "Active",
    allergies: ["Penicillin", "Peanuts"],
    history: ["Type 2 Diabetes", "Hypertension", "Hip Replacement (2021)"],
    implants: ["Pacemaker (#99281)"],
    insurance_id: "NHI-123-456-7890",
    doctor: "Dr. Sarah Smith",
    clinic: "Tanaka Internal Medicine"
  },
  ja: {
    name: "山田 花子",
    age: "78",
    blood: "O型",
    dnar: "あり",
    allergies: ["ペニシリン", "ピーナッツ"],
    history: ["2型糖尿病", "高血圧症", "人工股関節置換 (2021)"],
    implants: ["心臓ペースメーカー"],
    insurance_id: "123-456-7890",
    doctor: "田中 健太郎 医師",
    clinic: "田中内科クリニック"
  }
};

const AgentActionLog = ({ status, temp, language }) => {
  const [step, setStep] = useState(0);

  // SCRIPT A: FALL RESPONSE (EN)
  const fallScript_en = [
    { icon: <Brain className="w-4 h-4 text-zinc-500" />, text: `Vertex AI: Analyzing impact pattern (3.2G)...`, color: "text-zinc-300" },
    { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, text: "Result: CRITICAL. User unresponsive.", color: "text-red-400 font-bold" },
    { icon: <Phone className="w-4 h-4 text-amber-500" />, text: "Action: Triggering Twilio API (Call Son)...", color: "text-amber-200" },
    { icon: <Lock className="w-4 h-4 text-orange-500" />, text: "Action: Triggering Matter Protocol (Unlock Door)...", color: "text-orange-200" },
    { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: "Status: EMS notified. Waiting for arrival.", color: "text-green-400 font-medium" }
  ];

  // SCRIPT A: FALL RESPONSE (JA)
  const fallScript_ja = [
    { icon: <Brain className="w-4 h-4 text-zinc-500" />, text: `Vertex AI: 衝撃パターンを解析中 (3.2G)...`, color: "text-zinc-300" },
    { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, text: "判定: 危険。ユーザーの反応なし。", color: "text-red-400 font-bold" },
    { icon: <Phone className="w-4 h-4 text-amber-500" />, text: "アクション: 緊急連絡先（長男）へ発信中...", color: "text-amber-200" },
    { icon: <Lock className="w-4 h-4 text-orange-500" />, text: "アクション: スマートロック解除（救急隊用）...", color: "text-orange-200" },
    { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: "ステータス: 通報完了。救助を待機中。", color: "text-green-400 font-medium" }
  ];

  // SCRIPT B: HEATSTROKE RESPONSE (EN)
  const heatScript_en = [
    { icon: <Brain className="w-4 h-4 text-zinc-500" />, text: `Vertex AI: Analyzing thermal variance (${temp}°C)...`, color: "text-zinc-300" },
    { icon: <ThermometerSun className="w-4 h-4 text-orange-500" />, text: "Result: DANGEROUS HEAT INDEX. Dehydration risk.", color: "text-orange-400 font-bold" },
    { icon: <Wifi className="w-4 h-4 text-cyan-500" />, text: "Action: Connecting to Daikin Smart Hub...", color: "text-cyan-200" },
    { icon: <Wind className="w-4 h-4 text-blue-400" />, text: "Action: Remote AC Activation (Cool / 24°C)...", color: "text-blue-200" },
    { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: "Status: Cooling active. Family notified.", color: "text-green-400 font-medium" }
  ];

  // SCRIPT B: HEATSTROKE RESPONSE (JA)
  const heatScript_ja = [
    { icon: <Brain className="w-4 h-4 text-zinc-500" />, text: `Vertex AI: 室温上昇率を解析中 (${temp}°C)...`, color: "text-zinc-300" },
    { icon: <ThermometerSun className="w-4 h-4 text-orange-500" />, text: "判定: 熱中症リスク（危険レベル）。", color: "text-orange-400 font-bold" },
    { icon: <Wifi className="w-4 h-4 text-cyan-500" />, text: "アクション: ダイキン Smart Hub に接続中...", color: "text-cyan-200" },
    { icon: <Wind className="w-4 h-4 text-blue-400" />, text: "アクション: エアコン遠隔起動 (冷房 / 24°C)...", color: "text-blue-200" },
    { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: "ステータス: 室温低下中。家族へ通知済み。", color: "text-green-400 font-medium" }
  ];

  let steps = [];
  if (status === 'HEAT') {
    steps = language === 'ja' ? heatScript_ja : heatScript_en;
  } else {
    steps = language === 'ja' ? fallScript_ja : fallScript_en;
  }

  useEffect(() => {
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="dark-card bg-black/50 p-6 border-zinc-800 flex flex-col min-h-[300px] shadow-none animate-enter font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
        <ShieldAlert className={`w-5 h-5 ${status === 'HEAT' ? 'text-orange-500' : 'text-red-500'} animate-pulse`} />
        <span className={`${status === 'HEAT' ? 'text-orange-500' : 'text-red-500'} font-bold tracking-wider text-xs uppercase`}>
          {status === 'HEAT' ? 'THERMAL PROTECTION AGENT' : 'FALL RESPONSE AGENT'}
        </span>
      </div>
      <div className="flex-grow flex flex-col gap-4 justify-center">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-opacity duration-500 ${i > step ? 'opacity-0' : 'opacity-100'}`}>
            {s.icon}
            <span className={`${s.color}`}>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [userData, setUserData] = useState({
    status: 'SAFE',
    temp: 24.5,
    humidity: 50,
    heat_index: 24.5,
    battery: 100,
    ai_message: "System Initializing...",
    lastUpdate: Date.now() / 1000
  });
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [isDigestLoading, setIsDigestLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const t = translations[language];
  const p = MEDICAL_DATA[language];

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

  const handleGenerateDigest = async () => {
    setIsDigestLoading(true);
    try {
      if (!model) throw new Error("Vertex AI not initialized");

      // 1. Synthetic Demo Data
      const mockDailyLog = `
      07:00 Wake up detected. Room Temp: 22°C.
      07:30 Kitchen activity (Breakfast). Temp: 23°C.
      09:00 High movement duration (30 mins) - Likely Walk/Gardening.
      12:00 Living room (Sedentary). Temp: 25°C.
      14:00 No movement (60 mins) - Afternoon Nap. Vitals stable.
      18:00 Kitchen activity (Dinner).
      22:00 Lights off pattern detected. Sleep initiated.
      `;

      // 2. Vertex AI Call with context
      let prompt = "";
      if (language === 'ja') {
        prompt = `次のセンサーログを分析し、家族向けに安心できる2文の要約を自然な丁寧語（敬語）で作成してください。朝の散歩と午後の昼寝について言及してください。\nログ:\n${mockDailyLog}`;
      } else {
        prompt = `Analyze this sensor log. Write a 2-sentence reassuring summary for the family. Mention the healthy morning walk and the afternoon nap.\nLog:\n${mockDailyLog}`;
      }

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (db) {
        update(ref(db, 'users/senior_1'), { ai_message: text });
      }
    } catch (e) {
      console.error("Vertex AI Error:", e);
      // 3. Fallback for Demo Safety
      const fallbackText = language === 'ja' ?
        "本日は非常に健康的な一日でした。午前中は活発に散歩をされ、午後はゆっくりとお昼寝をされています。室温も適正に保たれています。" :
        "Data indicates a healthy routine. Active morning followed by a restful afternoon nap. No anomalies detected.";

      if (db) {
        update(ref(db, 'users/senior_1'), { ai_message: fallbackText });
      }
    } finally {
      setIsDigestLoading(false);
    }
  };

  const isCritical = userData.status === 'FALL' || userData.status === 'HEAT';

  // Dynamic Design Variables
  const statusColor = isCritical ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-accent-green)]';

  let currentStatusText = t.status_safe;
  if (userData.status === 'FALL') currentStatusText = t.status_fall;
  if (userData.status === 'HEAT') currentStatusText = t.status_heat;

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center texture-bg animate-pop text-[var(--color-dark-text-primary)]">

      {/* HEADER */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-10 pb-6 border-b border-[var(--color-dark-border)]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[var(--color-dark-text-primary)]" fill="currentColor" fillOpacity={0.1} />
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-dark-text-primary)]">
              {t.title}
            </h1>
          </div>
          <div className="flex gap-4 pl-11 text-xs font-mono text-[var(--color-dark-text-secondary)]">
            <span className="flex items-center gap-1"><Database size={10} /> {t.id_label}</span>
            <span className="flex items-center gap-1 text-[var(--color-accent-green)]"><LinkIcon size={10} /> {t.link_label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(l => l === 'en' ? 'ja' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-full transition-colors text-sm font-semibold text-[var(--color-dark-text-primary)]"
          >
            <Globe size={16} />
            {language === 'en' ? '日本語' : 'English'}
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* STATUS CARD - "The Listing" */}
        <div className="dark-card p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
          <div className="absolute top-6 right-6 opacity-10">
            <Activity size={120} className="text-white" />
          </div>

          <div>
            <h2 className="text-[var(--color-dark-text-secondary)] text-xs font-bold uppercase tracking-widest mb-2">{t.status_label}</h2>
            <div className={`text-2xl font-extrabold tracking-tight ${statusColor} ${isCritical ? 'animate-pulse' : ''}`}>
              {currentStatusText}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8 z-10">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <Thermometer className="text-[var(--color-dark-text-secondary)]" size={20} />
                <span className="text-[var(--color-dark-text-secondary)] font-medium">{t.temp_label}</span>
              </div>
              <span className="text-xl font-bold text-[var(--color-dark-text-primary)]">{userData.temp}°</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <Activity className="text-[var(--color-dark-text-secondary)]" size={20} />
                <span className="text-[var(--color-dark-text-secondary)] font-medium">{t.hr_label}</span>
              </div>
              <span className="text-xl font-bold text-[var(--color-dark-text-primary)]">72 BPM</span>
            </div>
          </div>
        </div>

        {/* AI INSIGHT / AGENT CARD */}
        {!isCritical ? (
          <div className="dark-card p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                  <h2 className="text-[var(--color-dark-text-primary)] font-bold text-sm tracking-wide">{t.ai_title}</h2>
                </div>
              </div>

              <div className="text-lg leading-relaxed text-[var(--color-dark-text-primary)] font-medium">
                {userData.ai_message ? (
                  <p>"{userData.ai_message}"</p>
                ) : (
                  <p className="text-zinc-500 italic">{t.ai_placeholder}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-end">
              <button
                onClick={handleGenerateDigest}
                disabled={isDigestLoading}
                className="text-sm border border-zinc-700 px-4 py-2 rounded-lg hover:border-zinc-500 font-semibold transition-colors flex items-center gap-2 text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-wait"
              >
                {isDigestLoading ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    {t.btn_loading}
                  </>
                ) : (
                  <>
                    <Brain size={14} />
                    {t.btn_generate}
                  </>
                )}
              </button>
              <div className="text-xs text-[var(--color-dark-text-secondary)]">
                {t.last_update} {new Date(userData.lastUpdate * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ) : (
          <AgentActionLog status={userData.status} temp={userData.temp} language={language} />
        )}

        {/* MEDICAL INFO BUTTON - "The CTA" */}
        <div className="md:col-span-2">
          <button
            onClick={() => setShowMedicalModal(true)}
            className="w-full bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] p-5 rounded-2xl shadow-lg hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-3 group text-lg transition-all duration-300 text-[var(--color-dark-text-primary)]"
          >
            <Ambulance className="group-hover:scale-110 transition-transform duration-300 text-[var(--color-accent-red)]" size={24} />
            <span className="font-bold tracking-wide">{t.btn_medical}</span>
          </button>
        </div>

      </div>

      {/* MEDICAL MODAL (PREMIUM DARK) */}
      {showMedicalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-pop">
          <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col">

            {/* HEADER */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start sticky top-0 bg-[var(--color-dark-card)] z-10">
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--color-dark-text-primary)]">{t.med_title}</h2>
                <p className="text-[var(--color-dark-text-secondary)] text-sm mt-1">{t.emergency_only}</p>
              </div>
              <button onClick={() => setShowMedicalModal(false)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-8 overflow-y-auto">
              {/* PROFILE HEADER */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-2xl font-bold text-zinc-500 border border-zinc-700">
                  {p.blood}
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-[var(--color-dark-text-primary)]">{p.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-bold text-zinc-300">{t.lbl_age}: {p.age}</span>
                    <span className="px-3 py-1 bg-red-900/50 border border-red-800 text-red-200 rounded-full text-xs font-bold">{t.lbl_dnar}: {p.dnar}</span>
                  </div>
                </div>
              </div>

              <hr className="border-zinc-800 my-8" />

              {/* ALERTS SECTION */}
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--color-dark-text-primary)]">
                  <AlertOctagon size={20} className="text-[var(--color-accent-red)]" />
                  {t.lbl_allergies}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {p.allergies.map((item, i) => (
                    <span key={i} className="px-4 py-2 bg-red-950/30 border border-red-900 rounded-full text-sm font-medium text-red-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-800 my-8" />

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-[var(--color-dark-text-primary)] mb-4">{t.lbl_history}</h4>
                  <ul className="space-y-3">
                    {p.history.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[var(--color-dark-text-secondary)]">
                        <Activity size={16} className="mt-1 flex-shrink-0 text-zinc-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-dark-text-primary)] mb-4">{t.lbl_implants}</h4>
                  <ul className="space-y-3">
                    {p.implants.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[var(--color-dark-text-secondary)]">
                        <Brain size={16} className="mt-1 flex-shrink-0 text-zinc-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr className="border-zinc-800 my-8" />

              {/* ADMIN CARD */}
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-[var(--color-dark-text-secondary)] mb-4">{t.lbl_insurance}</h4>
                    <p className="font-mono text-lg font-bold text-zinc-200">{p.insurance_id}</p>
                  </div>
                  <FileText className="text-zinc-700" size={32} />
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-dark-text-primary)]">
                    <Stethoscope size={16} className="text-emerald-500" />
                    <strong>{t.lbl_doctor}:</strong> {p.doctor}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-dark-text-primary)]">
                    <Ambulance size={16} className="text-emerald-500" />
                    <strong>{t.lbl_clinic}:</strong> {p.clinic}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
