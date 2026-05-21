import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Paper,
  IconButton,
  TextField,
  Avatar,
  Typography,
  Stack,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const AIChatbot = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful medical assistant providing clinical information. Be concise and safe." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    // auto-scroll when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (evt) => {
    if (evt) evt.preventDefault();
    const text = input.trim();
    if (!text) return;

    // append user message
    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const payload = { messages: nextMessages.filter(m => m.role !== 'system') };
      // Debug: log the resolved base URL and full request info
      try {
        // api.defaults.baseURL may be undefined in some builds; guard it
        // eslint-disable-next-line no-console
        console.log('AI request ->', (api.defaults && api.defaults.baseURL) ? `${api.defaults.baseURL}/ai/chat` : '/api/ai/chat', payload);
      } catch (e) {
        // ignore logging errors
      }
      const response = await api.post("/ai/chat", payload);
      const reply = response.data?.reply;
      if (reply && reply.content) {
        setMessages((prev) => [...prev, { role: reply.role || "assistant", content: reply.content }]);
      } else {
        setError("No reply from AI");
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const status = err.response?.status;
      if (status === 404) {
        setError(
          'API not found (404). Ensure `REACT_APP_BACKEND` is set to your backend URL in the deployment environment and the backend exposes /api/ai/chat.'
        );
      } else {
        setError(err.response?.data?.message || err.message || "Request failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "system", content: "You are a helpful medical assistant providing clinical information. Be concise and safe." }]);
    setError(null);
  };

  const bubbleSx = (role) => {
    const isUser = role === 'user';

    if (isUser) {
      return {
        maxWidth: '80%',
        p: 1.5,
        borderRadius: 2,
        bgcolor: isDark
          ? alpha(theme.palette.primary.main, 0.22)
          : alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.text.primary,
        border: isDark ? '1px solid rgba(125, 211, 252, 0.14)' : '1px solid rgba(14, 165, 233, 0.1)',
      };
    }

    return {
      maxWidth: '80%',
      p: 1.5,
      borderRadius: 2,
      bgcolor: isDark ? '#0f172a' : alpha(theme.palette.grey[200], 1),
      color: theme.palette.text.primary,
      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(148, 163, 184, 0.12)',
      boxShadow: isDark ? '0 12px 28px -18px rgba(0,0,0,0.7)' : 'none',
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <SmartToyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>AI Medical Assistant</Typography>
              <Typography variant="body2" color="text.secondary">Ask clinical questions, summarize reports, or get guidance.</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button startIcon={<RestartAltIcon />} onClick={clearChat} color="inherit">
              Clear
            </Button>
          </Stack>
        </Stack>

        <Box
          ref={listRef}
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
            p: 2,
            bgcolor: isDark ? 'rgba(2, 6, 23, 0.72)' : 'background.paper',
            borderRadius: 2,
            border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(148, 163, 184, 0.08)',
          }}
        >
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <Box key={idx} sx={{ display: 'flex', mb: 2, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role !== 'user' && (
                <Avatar sx={{ mr: 1, bgcolor: theme.palette.primary.light }}>{/* AI avatar */}</Avatar>
              )}
              <Box sx={bubbleSx(msg.role)}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'inherit' }}>{msg.content}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.role === 'user' ? (user?.firstName || 'You') : 'Assistant'}</Typography>
              </Box>
              {msg.role === 'user' && (
                <Avatar sx={{ ml: 1, bgcolor: theme.palette.secondary.main }}>{(user?.firstName || 'U')[0]}</Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">AI is typing...</Typography>
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>
          )}
        </Box>

        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Describe symptoms, ask questions, or paste a report..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
          />
          <IconButton color="primary" type="submit" disabled={loading || !input.trim()} sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.common.white, '&:hover': { bgcolor: theme.palette.primary.dark } }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default AIChatbot;
