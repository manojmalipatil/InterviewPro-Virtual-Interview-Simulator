import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoleSelection from './pages/RoleSelection';
import InterviewRound from './pages/InterviewRound';
import FinalSummary from './pages/FinalSummary';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="role-selection" element={<RoleSelection />} />
            <Route path="interview/:roleId/:roundId" element={<PrivateRoute><InterviewRound /></PrivateRoute>} />
            <Route path="summary/:roleId" element={<PrivateRoute><FinalSummary /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;