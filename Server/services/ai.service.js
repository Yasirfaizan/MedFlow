const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: "gemini-pro" });

exports.checkSymptoms = async (symptoms, age, gender, history) => {
  try {
    const model = getModel();
    const prompt = `You are a medical AI assistant. A doctor is consulting you.
Patient: ${age} year old ${gender}
Symptoms: ${symptoms}
Medical history: ${history || "None"}
Provide:
1. Top 3 possible conditions with likelihood percentage
2. Risk level: Low / Medium / High
3. Recommended diagnostic tests
4. Urgency level
Respond in valid JSON only. No extra text.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { success: true, data: parsed };
  } catch {
    return {
      success: false,
      fallback: true,
      message: "AI unavailable. Please consult manually.",
    };
  }
};

exports.explainPrescription = async (medicines, instructions) => {
  try {
    const model = getModel();
    const medList = medicines
      .map((m) => `${m.name} ${m.dosage} - ${m.frequency} for ${m.duration}`)
      .join(", ");
    const prompt = `You are a medical assistant explaining a prescription to a patient in simple language.
Medicines: ${medList}
Doctor's instructions: ${instructions || "Follow standard care"}
Provide:
1. Simple explanation of what each medicine does
2. How and when to take them
3. Foods and activities to avoid
4. Lifestyle recommendations
5. Warning signs (when to go to emergency)
Keep it friendly and easy to understand.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "Explanation not available. Please ask your doctor directly.";
  }
};

exports.translateToUrdu = async (text) => {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Translate the following medical explanation to Urdu language:\n\n${text}`,
    );
    return result.response.text();
  } catch {
    return "Urdu translation not available.";
  }
};
