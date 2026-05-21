import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ThemeModeProvider from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Profile from './pages/Profile';
import HomePage from './pages/HomePage';
import AIChatbot from './pages/AIChatbot';
import theme from './theme';

function App() {
  return (
    <ThemeModeProvider>
      <CssBaseline />
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/patient"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <PrivateRoute allowedRoles={["patient","doctor","hospital"]}>
                  <AIChatbot />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital"
              element={
                <PrivateRoute allowedRoles={['hospital']}>
                  <HospitalDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={['patient', 'doctor', 'hospital']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeModeProvider>
  );
}

export default App;
