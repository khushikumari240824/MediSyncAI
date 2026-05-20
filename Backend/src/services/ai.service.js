const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY;
const defaultModelName =
  process.env.GEMINI_MODEL ||
  "gemini-1.5-flash-latest";

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not set. AI features will fail until configured."
  );
}

const genAI =
  new GoogleGenerativeAI(
    apiKey
  );

async function chat(
  messages = [],
  options = {}
) {
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
          defaultModelName,
      }
    );

  // Take latest user message
  const latestMessage =
    messages[
      messages.length - 1
    ]?.content;

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
}

async function symptomCheck(
  {
    symptoms,
    age,
    sex,
    medicalHistory,
  },
  options = {}
) {
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
          defaultModelName,
      }
    );

  const prompt = `
You are a medical assistant.

Analyze these symptoms carefully:

Symptoms: ${symptoms}
Age: ${
    age || "unknown"
  }
Sex: ${
    sex || "unknown"
  }
Medical History: ${
    medicalHistory ||
    "none"
  }

Provide:
1. Possible causes (3–5)
2. Likelihood level
3. Basic precautions
4. When to see a doctor

Do NOT provide prescriptions or final diagnosis.
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
}

module.exports = {
  chat,
  symptomCheck,
};