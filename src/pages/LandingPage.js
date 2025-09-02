import React from 'react';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';

const LandingPage = ({ user, onLogout }) => {
    return (
        <div>
            <Navbar user={user} onLogout={onLogout} />
            <div className="landing-page-container">
                <ChatWindow />
            </div>
        </div>
    );
};

export default LandingPage;
