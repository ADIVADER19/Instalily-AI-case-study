import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/signup', { username, password });
            Swal.fire({
                icon: 'success',
                title: 'Signup Successful',
                text: 'Redirecting to login...',
                timer: 1800,
                showConfirmButton: false
            });
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: err.response?.data?.error || 'Signup failed',
            });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
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
                    <button type="submit">Signup</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
