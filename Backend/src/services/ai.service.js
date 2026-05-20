const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

// Get Gemini API key from .env
const apiKey =
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not set. AI features will fail."
  );
}

// Initialize Gemini
const genAI =
  new GoogleGenerativeAI(
    apiKey
  );

/**
 * Chat with AI
 */
async function chat(
  messages = [],
  options = {}
) {
  try {
    if (
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      throw new Error(
        "Messages must be a non-empty array"
      );
    }

    const model =
      genAI.getGenerativeModel(
        {
          model:
            options.model ||
            "gemini-1.5-flash",
        }
      );

    // Get latest user message
    const latestMessage =
      messages[
        messages.length - 1
      ]?.content;

    if (!latestMessage) {
      throw new Error(
        "User message is required"
      );
    }

    const result =
      await model.generateContent(
        latestMessage
      );

    const response =
      await result.response;

    return {
      role: "assistant",
      content:
        response.text(),
    };
  } catch (error) {
    console.error(
      "Gemini Chat Error:",
      error.message
    );

    throw new Error(
      "AI error"
    );
  }
}

/**
 * AI Symptom Checker
 */
async function symptomCheck(
  {
    symptoms,
    age,
    sex,
    medicalHistory,
  },
  options = {}
) {
  try {
    if (!symptoms) {
      throw new Error(
        "Symptoms are required"
      );
    }

    const model =
      genAI.getGenerativeModel(
        {
          model:
            options.model ||
            "gemini-1.5-flash",
        }
      );

    const prompt = `
You are a medical assistant chatbot.

Analyze these symptoms carefully:

Symptoms: ${symptoms}

Age: ${
      age || "unknown"
    }

Sex: ${
      sex || "unknown"
    }

Medical History:
${
      medicalHistory ||
      "none"
    }

Provide:

1. Possible causes (3-5)

2. Severity level
(low / moderate / high)

3. Basic precautions

4. When to consult a doctor

Important:
- Do NOT provide final diagnosis.
- Do NOT prescribe medicines.
- Suggest emergency care if symptoms seem serious.
`;

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    return {
      analysis:
        response.text(),
    };
  } catch (error) {
    console.error(
      "Gemini Symptom Error:",
      error.message
    );

    throw new Error(
      "AI error"
    );
  }
}

module.exports = {
  chat,
  symptomCheck,
};