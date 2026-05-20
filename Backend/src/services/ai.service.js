const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey =
  process.env.GEMINI_API_KEY;
const defaultModelName =
  process.env.GEMINI_MODEL ||
  "gemini-1.5-flash-latest";
const fallbackModelNames = [
  defaultModelName,
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro",
].filter(Boolean);

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not set. AI features will fail until configured."
  );
}

const genAI =
  new GoogleGenerativeAI(
    apiKey
  );

function buildContents(messages) {
  return messages.map((message) => ({
    role:
      message.role === "assistant"
        ? "model"
        : "user",
    parts: [
      {
        text: String(
          message.content || ""
        ),
      },
    ],
  }));
}

async function generateWithFallback(
  promptOrMessages,
  options = {}
) {
  const candidateModels = [
    ...(options.model ? [options.model] : []),
    ...fallbackModelNames,
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model =
        genAI.getGenerativeModel({
          model: modelName,
        });

      const result =
        await model.generateContent(
          promptOrMessages
        );
      const response =
        await result.response;

      return {
        model: modelName,
        text: response.text(),
      };
    } catch (error) {
      lastError = error;
      const message =
        String(error?.message || error);
      const isModelNotFound =
        message.includes("404") ||
        message.includes("not found") ||
        message.includes("is not found") ||
        message.includes(
          "not supported"
        );

      if (!isModelNotFound) {
        throw error;
      }
    }
  }

  throw lastError || new Error("AI request failed");
}

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

  const contents = buildContents(
    messages
  );

  const response =
    await generateWithFallback(
      contents,
      options
    );

  return {
    role: "assistant",
    content: response.text,
    model: response.model,
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

  const response =
    await generateWithFallback(
      prompt,
      options
    );

  return {
    analysis: response.text,
    model: response.model,
  };
}

module.exports = {
  chat,
  symptomCheck,
};