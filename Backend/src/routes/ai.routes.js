const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middlewares/auth');
const aiService = require('../services/ai.service');

const router = express.Router();

// Chat endpoint: expects `messages` array [{role:'user'|'system'|'assistant', content:''}, ...]
router.post(
  '/chat',
  auth,
  [body('messages').isArray().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { messages } = req.body;
      const reply = await aiService.chat(messages);
      return res.json({ reply });
    } catch (err) {
      console.error('AI chat error:', err.message || err);
      return res.status(500).json({ message: 'AI error', error: err.message });
    }
  },
);

// Symptom checker endpoint
router.post(
  '/symptom-check',
  auth,
  [body('symptoms').notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { symptoms, age, sex, medicalHistory } = req.body;
      const result = await aiService.symptomCheck({ symptoms, age, sex, medicalHistory });
      return res.json({ result });
    } catch (err) {
      console.error('Symptom checker error:', err.message || err);
      return res.status(500).json({ message: 'AI error', error: err.message });
    }
  },
);

module.exports = router;
