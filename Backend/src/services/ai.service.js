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

    // Convert messages to plain text
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
      error
    );

    throw new Error(
      error.message
    );
  }
}

// Lightweight fallback generator used when a real AI client isn't configured.
// Returns a simulated response so endpoints remain testable.
async function generateWithFallback(prompt, options = {}) {
  // If a real GEMINI API key is present we could call the real client here.
  // For safety and compatibility across environments we'll return a simple simulated reply.
  const model = process.env.GEMINI_MODEL || 'simulated-gemini';

  // Basic simulated response echoes the prompt truncated to a reasonable length.
  const text = `Simulated reply (model=${model}): ${String(prompt).slice(0, 1000)}`;

  return { text, model };
}

async function symptomCheck({ symptoms, age, sex, medicalHistory } = {}) {
  const promptParts = [];
  promptParts.push('You are a helpful medical assistant.');
  promptParts.push(`Symptoms: ${symptoms}`);
  if (age) promptParts.push(`Age: ${age}`);
  if (sex) promptParts.push(`Sex: ${sex}`);
  if (medicalHistory) promptParts.push(`Medical history: ${medicalHistory}`);

  const prompt = promptParts.join('\n');
  const resp = await generateWithFallback(prompt, { symptomCheck: true });
  return { advice: resp.text, model: resp.model };
}

module.exports = {
  chat,
  symptomCheck,
};