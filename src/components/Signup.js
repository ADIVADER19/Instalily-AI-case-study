import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register', { username, password });
            setMessage('Signup successful! Please login.');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
            setMessage('');
        }
    };

    return (
        <div className="auth-form">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
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
                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default Signup;
