import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
                title: 'Account Created!',
                text: 'Redirecting to login...',
                timer: 1800,
                showConfirmButton: false,
                confirmButtonColor: '#1b3875'
            });
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: err.response?.data?.error || 'Signup failed',
                confirmButtonColor: '#1b3875'
            });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Create Account</h2>
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength="3"
                    />
                    <input
                        type="password"
                        placeholder="Choose a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                    <button type="submit">Create Account</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
