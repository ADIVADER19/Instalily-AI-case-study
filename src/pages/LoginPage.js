import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });
            setToken(response.data.token);
            window.localStorage.setItem('username', username);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome, ${username}!`,
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/chat');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.error || 'Invalid credentials',
            });
        }
    };

    return (
        <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)' }}>
            <div className="auth-form" style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 32px rgba(60,80,120,0.10)', padding: '48px 36px', minWidth: '340px', maxWidth: '400px', width: '100%' }}>
                <h2 style={{ color: '#1b3875', fontWeight: 700, fontSize: '2rem', marginBottom: '24px', textAlign: 'center' }}>Login</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1.5px solid #cfdef3', fontSize: '1.1rem', outline: 'none' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1.5px solid #cfdef3', fontSize: '1.1rem', outline: 'none' }}
                    />
                    <button type="submit" style={{ background: 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(60,80,120,0.08)' }}>Login</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '18px', color: '#3a7bd5' }}>
                    Don't have an account? <a href="/signup" style={{ color: '#1b3875', fontWeight: 600, textDecoration: 'underline' }}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
