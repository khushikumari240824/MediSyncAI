const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middlewares/auth');
const aiService = require('../services/ai.service');

const router = express.Router();
// Allow disabling auth for AI endpoints (useful for local testing)
// Set AI_REQUIRE_AUTH=false in .env to skip authentication on these routes
const requireAiAuth = (req, res, next) => {
  if (process.env.AI_REQUIRE_AUTH === 'false') return next();
  return auth(req, res, next);
};

// Chat endpoint: expects `messages` array [{role:'user'|'system'|'assistant', content:''}, ...]
router.post(
  '/chat',
  requireAiAuth,
  [body('messages').isArray().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { messages } = req.body;
      const reply = await aiService.chat(messages);
      return res.json({ reply });
    } catch (err) {
      console.error('AI chat error:', err);
      return res.status(500).json({
        message: 'AI error',
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    }
  },
);

// Symptom checker endpoint
router.post(
  '/symptom-check',
  requireAiAuth,
  [body('symptoms').notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { symptoms, age, sex, medicalHistory } = req.body;
      const result = await aiService.symptomCheck({ symptoms, age, sex, medicalHistory });
      return res.json({ result });
    } catch (err) {
      console.error('Symptom checker error:', err);
      return res.status(500).json({
        message: 'AI error',
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    }
  },
);

module.exports = router;
