import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import { useAuth } from './context/AuthContext';


function App() {
    const { token, login, logout, user } = useAuth();

    const handleLogout = () => {
        window.localStorage.removeItem('username');
        logout();
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={!token ? <LoginPage setToken={login} /> : <Navigate to="/chat" />} />
                    <Route path="/signup" element={!token ? <SignupPage /> : <Navigate to="/chat" />} />
                    <Route path="/chat" element={token ? <ChatPage token={token} setToken={handleLogout} /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
