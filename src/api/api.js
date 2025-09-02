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
