import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';
import { getChatHistory } from '../api/api'; // Assuming you have this function
import '../components/Navbar.css';
import '../components/ChatWindow.css';

const ChatPage = ({ token, setToken }) => {
    const [user, setUser] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const decodedToken = jwtDecode(token);
            setUser({ username: decodedToken.username });

            const fetchHistory = async () => {
                try {
                    const history = await getChatHistory(token);
                    setChatHistory(history);
                } catch (error) {
                    console.error('Failed to fetch chat history:', error);
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        handleLogout();
                    }
                }
            };
            fetchHistory();
        } catch (error) {
            console.error('Invalid token:', error);
            handleLogout();
        }
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', margin: 0, padding: 0 }}>
            <Navbar onLogout={handleLogout} />
            <div style={{ flex: 1, display: 'flex', marginTop: '68px' }}>
                <ChatWindow token={token} />
            </div>
        </div>
    );
};

export default ChatPage;
