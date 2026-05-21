# Frontend Setup

## Prerequisites
- Node.js 18+
- Backend API running on `http://localhost:5001`

## Install & Run
```bash
npm install
npm start
```

Frontend runs on:
- `http://localhost:3000`

## API Integration
This app uses CRA proxy in `package.json`:
- `"proxy": "http://localhost:5001"`

So requests like `/api/auth/login` are automatically forwarded to backend.

## Optional Environment File
Create `.env` from `.env.example` only if you want to override defaults.

## Common Issues
### Network Error on register/login
- Ensure backend is running (`npm run dev` in backend)
- Ensure backend port matches frontend proxy (5001)
- Ensure MongoDB is connected

### Port already in use
- Change frontend port temporarily:
```bash
set PORT=3001 && npm start
```
