
// Client-side User model for API interactions
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const User = {
    async register(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                username,
                password
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Registration failed' 
            };
        }
    },

    async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                username,
                password
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return { success: true };
    },

    getStoredToken() {
        return localStorage.getItem('token');
    },

    getStoredUsername() {
        return localStorage.getItem('username');
    },

    isLoggedIn() {
        return !!this.getStoredToken();
    }
};

const ChatHistory = {
    async addMessagePair(username, userContent, assistantContent, category) {
        try {
            const token = User.getStoredToken();
            const response = await axios.post(`${API_BASE_URL}/chat/history`, {
                username,
                userContent,
                assistantContent,
                category: category || 'general'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to save message' 
            };
        }
    },

    async getHistory(username) {
        try {
            const token = User.getStoredToken();
            const response = await axios.get(`${API_BASE_URL}/chat/history/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to get history' 
            };
        }
    },

    async clearHistory(username) {
        try {
            const token = User.getStoredToken();
            const response = await axios.delete(`${API_BASE_URL}/chat/history/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Failed to clear history' 
            };
        }
    }
};

export { User, ChatHistory };
