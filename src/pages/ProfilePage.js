import React, { useEffect, useState } from 'react';
import { getChatHistory, clearChatHistory } from '../api/api';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const MAX_MESSAGE_LENGTH = 400;

const formatResponse = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
    .replace(/### (.*?)(?=\n|$)/g, '<h3 style="font-size: 1.1rem; font-weight: 600; margin: 8px 0 4px 0; color: #4a5568;">$1</h3>') // H3 headers
    .replace(/## (.*?)(?=\n|$)/g, '<h2 style="font-size: 1.15rem; font-weight: 600; margin: 10px 0 6px 0; color: #2d3748;">$1</h2>') // H2 headers
    .replace(/# (.*?)(?=\n|$)/g, '<h1 style="font-size: 1.2rem; font-weight: 600; margin: 12px 0 8px 0; color: #2d3748;">$1</h1>') // H1 headers
    .replace(/\n\n/g, '</p><p style="margin: 8px 0; line-height: 1.6;">') // Paragraphs
    .replace(/\n/g, '<br>') // Line breaks
    .replace(/^(.*)$/, '<p style="margin: 8px 0; line-height: 1.6;">$1</p>'); // Wrap in paragraph tags
};

function ReadMore({ content }) {
    const [expanded, setExpanded] = useState(false);
    const formattedContent = formatResponse(content || '');
    
    if (formattedContent.length <= MAX_MESSAGE_LENGTH) {
        return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
    }
    return (
        <>
            <span dangerouslySetInnerHTML={{ __html: expanded ? formattedContent : formattedContent.slice(0, MAX_MESSAGE_LENGTH) + '...' }} />
            <button
                style={{
                    marginTop: '12px',
                    background: 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(60, 80, 120, 0.08)',
                }}
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? 'Show less' : 'Read more'}
            </button>
        </>
    );
}
ReadMore.propTypes = {
    content: PropTypes.string.isRequired,
};

const cardColors = {
    user: 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)',
    assistant: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
};

function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function Avatar({ role }) {
    return (
        <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: role === 'user' ? 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)' : 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 18,
            fontWeight: 700,
            color: role === 'user' ? '#fff' : '#1b3875',
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(60, 80, 120, 0.08)',
        }}>
            {role === 'user' ? 'U' : 'A'}
        </div>
    );
}
Avatar.propTypes = {
    role: PropTypes.string.isRequired,
};

const ProfilePage = () => {
        const token = window.localStorage.getItem('token');
        const user = { username: window.localStorage.getItem('username') || 'Guest' };
        let logout = null;
        try {
            logout = require('../context/AuthContext').useAuth?.().logout;
        } catch (e) {}
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleClearHistory = async () => {
        const result = await Swal.fire({
            title: 'Clear Chat History?',
            text: 'This action cannot be undone. All your chat history will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear it!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            customClass: {
                popup: 'swal-popup'
            }
        });

        if (result.isConfirmed) {
            try {
                await clearChatHistory(token);
                setConversations([]);
                Swal.fire({
                    title: 'Cleared!',
                    text: 'Your chat history has been cleared successfully.',
                    icon: 'success',
                    confirmButtonColor: '#667eea',
                    background: '#fff',
                    customClass: {
                        popup: 'swal-popup'
                    }
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to clear chat history. Please try again.',
                    confirmButtonColor: '#667eea',
                    background: '#fff',
                    customClass: {
                        popup: 'swal-popup'
                    }
                });
            }
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getChatHistory(token);
                if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].messages)) {
                    setConversations(data);
                } else {
                    setConversations([{ messages: data }]);
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading History',
                    text: 'Failed to load chat history. Please refresh the page.',
                    confirmButtonColor: '#667eea',
                    background: '#fff',
                    customClass: {
                        popup: 'swal-popup'
                    }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '80px' }}>Loading...</div>;

    const totalChats = Array.isArray(conversations) ? conversations.length : 0;

    // Use specific categories: refrigerator, dishwasher, payment
    const categories = ['refrigerator', 'dishwasher', 'payment'];

    const filteredConversations = categoryFilter === 'all'
        ? conversations
        : conversations.map(conv => ({
            ...conv,
            messages: Array.isArray(conv.messages)
                ? conv.messages.filter(msg => (msg.category || 'general') === categoryFilter)
                : []
        })).filter(conv => conv.messages.length > 0);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', color: '#1b3875' }}>
            <Navbar user={user?.username} onLogout={logout} />
            <div style={{ width: '100vw', maxWidth: '1200px', margin: '0 auto', marginTop: '110px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'rgba(255,255,255,0.8)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(60,80,120,0.12)', padding: '40px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontWeight: 800, fontSize: '2.3rem', color: '#1b3875', letterSpacing: '0.04em', fontFamily: 'inherit' }}>Welcome, {user?.username}</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '16px' }}>
                    <div style={{ background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: '16px', padding: '22px 38px', boxShadow: '0 4px 16px rgba(60,80,120,0.10)', fontWeight: 700, color: '#1b3875', fontSize: '1.25rem', fontFamily: 'inherit' }}>
                        <span aria-label="chat" title="Chats" style={{ fontSize: '1.5rem', marginRight: '8px' }}>�</span> Chats: {filteredConversations.length}
                    </div>
                </div>
                <div style={{ textAlign: 'left', margin: '0 48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                        <h2 style={{ color: '#1b3875', fontWeight: 800, fontSize: '1.7rem', margin: 0, letterSpacing: '0.03em', fontFamily: 'inherit' }}>Recent Conversations</h2>
                        <button
                            onClick={handleClearHistory}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '1rem',
                                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
                        >
                            🗑️ Clear History
                        </button>
                    </div>
                    <div style={{ marginBottom: '18px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '1.08rem', color: '#3a7bd5' }}>Filter by category:</span>
                        <button
                            style={{ 
                                padding: '8px 18px', 
                                borderRadius: '999px', 
                                border: 'none', 
                                background: categoryFilter === 'all' ? 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)' : '#f3f4f6', 
                                color: categoryFilter === 'all' ? '#fff' : '#1b3875', 
                                fontWeight: 600, 
                                cursor: 'pointer', 
                                boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setCategoryFilter('all')}
                        >
                            All
                        </button>
                        <button
                            style={{ 
                                padding: '8px 18px', 
                                borderRadius: '999px', 
                                border: 'none', 
                                background: categoryFilter === 'refrigerator' ? 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)' : '#f3f4f6', 
                                color: categoryFilter === 'refrigerator' ? '#fff' : '#1b3875', 
                                fontWeight: 600, 
                                cursor: 'pointer', 
                                boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setCategoryFilter('refrigerator')}
                        >
                            🧊 Refrigerator
                        </button>
                        <button
                            style={{ 
                                padding: '8px 18px', 
                                borderRadius: '999px', 
                                border: 'none', 
                                background: categoryFilter === 'dishwasher' ? 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)' : '#f3f4f6', 
                                color: categoryFilter === 'dishwasher' ? '#fff' : '#1b3875', 
                                fontWeight: 600, 
                                cursor: 'pointer', 
                                boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setCategoryFilter('dishwasher')}
                        >
                            🍽️ Dishwasher
                        </button>
                        <button
                            style={{ 
                                padding: '8px 18px', 
                                borderRadius: '999px', 
                                border: 'none', 
                                background: categoryFilter === 'payment' ? 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)' : '#f3f4f6', 
                                color: categoryFilter === 'payment' ? '#fff' : '#1b3875', 
                                fontWeight: 600, 
                                cursor: 'pointer', 
                                boxShadow: '0 2px 8px rgba(60,80,120,0.07)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setCategoryFilter('payment')}
                        >
                            💳 Payment
                        </button>
                    </div>
                    {(!Array.isArray(filteredConversations) || filteredConversations.length === 0) && (
                        <div style={{ textAlign: 'center', color: '#555', fontSize: '1.2rem' }}>No chat history yet.</div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {Array.isArray(filteredConversations) && filteredConversations.map((conv, idx) => {
                            const key = conv._id || idx;
                            return (
                                <div key={key} style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 8px 32px rgba(60,80,120,0.12)', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 700, color: '#1b3875', fontSize: '1.2rem', letterSpacing: '0.01em' }}>Support</span>
                                        <span style={{ color: '#888', fontSize: '1rem' }}>{conv.messages && conv.messages[0] && conv.messages[0].user && conv.messages[0].user.timestamp ? formatTime(conv.messages[0].user.timestamp) : 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                        {Array.isArray(conv.messages) && conv.messages.length > 0 ? (
                                            conv.messages.map((msg, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '12px', background: '#f8fafc', borderRadius: '14px', boxShadow: '0 2px 8px rgba(60,80,120,0.07)', padding: '18px 24px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
                                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(90deg, #1b3875 0%, #3a7bd5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1.3rem', boxShadow: '0 2px 8px rgba(60,80,120,0.10)' }}>U</div>
                                                        <span style={{ color: '#1b3875', fontWeight: 600, fontSize: '1rem' }}>You</span>
                                                    </div>
                                                    <div style={{ flex: 1, color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: '6px' }}>
                                                        {msg.user && msg.user.content ? <ReadMore content={msg.user.content} /> : <span style={{ color: '#888' }}>No message</span>}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
                                                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1b3875', fontSize: '1.3rem', boxShadow: '0 2px 8px rgba(60,80,120,0.10)' }}>A</div>
                                                        <span style={{ color: '#3a7bd5', fontWeight: 600, fontSize: '1rem' }}>AI</span>
                                                    </div>
                                                    <div style={{ flex: 1, color: '#222', fontWeight: 500, fontSize: '1.08rem', marginBottom: '6px' }}>
                                                        {msg.assistant && msg.assistant.content ? <ReadMore content={msg.assistant.content} /> : <span style={{ color: '#888' }}>No reply</span>}
                                                    </div>
                                                    <div style={{ marginTop: '8px', fontSize: '0.95rem', color: '#6d28d9', fontWeight: 600 }}>
                                                        Category: {msg.category ? msg.category.charAt(0).toUpperCase() + msg.category.slice(1) : 'General'}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{ color: '#888' }}>No messages in this conversation.</span>
                                        )}
                                    </div>
                                    <div style={{ position: 'absolute', top: '18px', right: '32px', color: '#888', fontSize: '0.95rem', fontWeight: 500 }}>
                                        {conv.messages ? conv.messages.length : 0} messages
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
