import axios from 'axios';

const getAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getAIMessage = async (userQuery, token) => {
  try {
    const response = await axios.post('/api/chat', {
      message: userQuery,
    }, getAuthHeaders(token));
    return {
      role: 'assistant',
      content: response.data.response,
    };
  } catch (error) {
    console.error('Error fetching AI message:', error);
    return {
      role: 'assistant',
      content: 'Sorry, I am having trouble connecting. Please try again later.',
    };
  }
};

export const getChatHistory = async (token) => {
    try {
        const response = await axios.get('/api/chat/history', getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
};

export const clearChatHistory = async (token) => {
    try {
        const response = await axios.delete('/api/chat/history', getAuthHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        throw error;
    }
};

export const getProductInfo = async (message, token) => {
    try {
        const response = await axios.post('/api/products', {
            message: message,
        }, getAuthHeaders(token));
        return {
            role: 'assistant',
            content: response.data.productInfo,
        };
    } catch (error) {
        console.error('Error fetching product info:', error);
        return {
            role: 'assistant',
            content: 'Sorry, I am having trouble getting product information. Please try again later.',
        };
    }
};

export const getOrderSupport = async (message, token) => {
    try {
        const response = await axios.post('/api/order-support', {
            message: message,
        }, getAuthHeaders(token));
        return {
            role: 'assistant',
            content: response.data.orderSupport,
        };
    } catch (error) {
        console.error('Error fetching order support:', error);
        return {
            role: 'assistant',
            content: 'Sorry, I am having trouble with order support. Please try again later.',
        };
    }
};

export const getWarrantySupport = async (message, token) => {
    try {
        const response = await axios.post('/api/warranty', {
            message: message,
        }, getAuthHeaders(token));
        return {
            role: 'assistant',
            content: response.data.warrantySupport,
        };
    } catch (error) {
        console.error('Error fetching warranty support:', error);
        return {
            role: 'assistant',
            content: 'Sorry, I am having trouble with warranty support. Please try again later.',
        };
    }
};
