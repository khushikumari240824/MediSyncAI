const {
  GoogleGenerativeAI,
} = require(
  "@google/generative-ai"
);

// Gemini API key
const apiKey =
  process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not set."
  );
}

// Initialize Gemini
const genAI =
  new GoogleGenerativeAI(
    apiKey
  );

/**
 * Real Gemini call
 */
async function generateWithFallback(
  prompt,
  options = {}
) {
  try {
    const modelName =
      process.env
        .GEMINI_MODEL ||
      "gemini-2.5-flash";

    const model =
      genAI.getGenerativeModel(
        {
          model:
            modelName,
        }
      );

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    return {
      text:
        response.text(),
      model:
        modelName,
    };
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error.message
    );

    throw error;
  }
}

/**
 * Chat AI
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

    // Convert message array to plain text
    const userPrompt =
      messages
        .map(
          (msg) =>
            msg.content
        )
        .join("\n");

    const response =
      await generateWithFallback(
        userPrompt,
        options
      );

    return {
      role: "assistant",
      content:
        response.text,
      model:
        response.model,
    };
  } catch (error) {
    console.error(
      "Gemini Chat Error:",
      error.message
    );

    throw new Error(
      error.message
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
  } = {},
  options = {}
) {
  try {
    if (!symptoms) {
      throw new Error(
        "Symptoms are required"
      );
    }

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

1. Possible causes (3–5)

2. Severity level
(low / moderate / high)

3. Basic precautions

4. When to consult a doctor

Important:
- Do NOT provide final diagnosis.
- Do NOT prescribe medicines.
- Suggest emergency care if symptoms seem serious.
`;

    const response =
      await generateWithFallback(
        prompt,
        options
      );

    return {
      advice:
        response.text,
      model:
        response.model,
    };
  } catch (error) {
    console.error(
      "Gemini Symptom Error:",
      error.message
    );

    throw new Error(
      error.message
    );
  }
}

module.exports = {
  chat,
  symptomCheck,
};