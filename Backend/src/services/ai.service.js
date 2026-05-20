const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: OPENAI_API_KEY is not set. AI features will fail until configured.');
}

const client = new OpenAI({ apiKey });

async function chat(messages = [], options = {}) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages must be a non-empty array');
  }

  const model = options.model || 'gpt-4o-mini';
  const max_tokens = options.max_tokens || 512;

  const resp = await client.chat.completions.create({
    model,
    messages,
    max_tokens,
  });

  // Return the assistant's content from the first choice
  return resp.choices?.[0]?.message || null;
}

async function symptomCheck({ symptoms, age, sex, medicalHistory }, options = {}) {
  if (!symptoms) throw new Error('symptoms are required');

  const system = {
    role: 'system',
    content:
      'You are a medical assistant. Provide a concise differential diagnosis list (3-5 items) with likelihood and recommended next steps. Do NOT provide definitive diagnoses or prescriptions. Always urge urgent care for red flags. Return results as JSON with keys: conditions (array of {name, likelihood, notes}), urgency (low|moderate|high|emergency), recommendedActions (array of strings).',
  };

  const userContent = `Symptoms: ${symptoms}\nAge: ${age || 'unknown'}\nSex: ${sex || 'unknown'}\nMedical history: ${medicalHistory || 'none'}`;

  const messages = [system, { role: 'user', content: userContent }];

  const reply = await chat(messages, options);
  // Try to parse JSON from the assistant if it returns JSON
  const text = reply?.content || '';
  try {
    const jsonStart = text.indexOf('{');
    const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text;
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (e) {
    // If parsing fails, return raw text as fallback
    return { raw: text };
  }
}

module.exports = { chat, symptomCheck };
