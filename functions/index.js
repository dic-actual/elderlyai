const admin = require('firebase-admin');
const fs = require('fs');

// SETUP:
// 1. Go to Firebase Console > Project Settings > Service Accounts
// 2. Generate new private key
// 3. Save the file as 'service-account.json' in this directory

const SERVICE_ACCOUNT_PATH = './service-account.json';

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("ERROR: 'service-account.json' not found.");
    console.error("Please download your Firebase Service Account key and save it as 'service-account.json' in the 'functions' directory.");
    process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // TODO: Replace with your actual database URL if it's not inferred correctly or if using a specific region
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com` 
});

const db = admin.database();
const ref = db.ref('/users/senior_1/status');

console.log("------------------------------------------------");
console.log("AI BRAIN (BACKEND) ONLINE");
console.log("Listening for status changes on /users/senior_1/status");
console.log("------------------------------------------------");

let processing = false;

ref.on('value', async (snapshot) => {
    const status = snapshot.val();
    console.log(`[REALTIME EVENT] Status Update: ${status}`);

    if (status === 'FALL' && !processing) {
        processing = true;
        console.log("\n>>> CRITICAL EVENT DETECTED: FALL <<<");
        console.log(">>> INITIATING AI ANALYSIS PROTOCOL...");
        
        // Simulate fetching pre-fall motion data (mock)
        const mockMotionData = "[-0.2, 0.1, 9.8] ... [24.5, 1.2, 3.4] (Impact)";
        
        // Construct the Prompt (as requested)
        const prompt = `You are an empathetic nurse. The sensor detected a fall at ${new Date().toLocaleTimeString()}. Analyze the 60 seconds of pre-fall motion ${mockMotionData}. Tell the family in 1 sentence if it looks accidental or critical.`;
        
        console.log(`\n[LLM PROMPT]: ${prompt}`);
        console.log(">>> Calling LLM API (Simulated)...");

        // Simulate AI Latency
        await new Promise(r => setTimeout(r, 2000));

        const aiResponse = generateAIInsight();
        console.log(`\n[LLM RESPONSE]: "${aiResponse}"`);

        // Update Database with AI Message
        await db.ref('/users/senior_1/ai_message').set(aiResponse);
        console.log(">>> Dashboard updated with AI insight.\n");
        
        // Reset processing flag after a delay to allow for new events
        setTimeout(() => { processing = false; }, 5000);
    } else if (status === 'SAFE') {
        processing = false;
    }
});

function generateAIInsight() {
    // Mock LLM Response
    const responses = [
        "Analyzing... Impact consistent with sliding off sofa. Ambulance notified.",
        "Sudden deceleration detected but vital signs are stable. Contacting primary caregiver to check in.",
        "Heavy impact detected on hard surface. User unresponsive. Emergency services have been alerted immediately."
    ];
    // Return a random response or the first one
    return responses[0]; 
}
