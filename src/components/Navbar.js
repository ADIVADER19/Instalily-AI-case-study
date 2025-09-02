import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/" className="brand-link">PartSelect</Link>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-nav">
                        <Link to="/profile" className="nav-link profile-button">Profile</Link>
                    </div>
                    <div className="navbar-user">
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;