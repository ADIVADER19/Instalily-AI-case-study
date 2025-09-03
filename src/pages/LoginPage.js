import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
                showConfirmButton: false,
                confirmButtonColor: '#1b3875'
            });
            navigate('/chat');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.error || 'Invalid credentials',
                confirmButtonColor: '#1b3875'
            });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
