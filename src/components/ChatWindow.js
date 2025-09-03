import React, { useState, useRef, useEffect } from "react";
import "./ChatWindow.css";
import { getAIMessage } from "../api/api";
import Swal from "sweetalert2";

const formatResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
    .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
    .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.*)$/, '<p>$1</p>');
};

const SUGGESTIONS = [
  "How can I reset my refrigerator?",
  "Why is my washing machine making noise?",
  "How do I update my payment method?",
];

const ChatWindow = ({ token }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to AI Support Chat! Hi! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (content) => {
    if (!content.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);
    
    try {
      const aiResponse = await getAIMessage(content, token);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Unable to connect to the server. Please try again.',
        confirmButtonColor: '#667eea',
        background: '#fff',
        customClass: {
          popup: 'swal-popup'
        }
      });
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <img
              className="chat-avatar"
              src={
                msg.role === "user"
                  ? "https://ui-avatars.com/api/?name=U&background=1b3875&color=fff"
                  : "https://ui-avatars.com/api/?name=AI&background=e0eafc&color=1b3875"
              }
              alt={msg.role === "user" ? "U" : "AI"}
            />
            <div className="chat-content">
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <img className="chat-avatar" src="https://ui-avatars.com/api/?name=AI&background=e0eafc&color=1b3875" alt="AI" />
            <div className="chat-content">
              <div className="chat-loader">
                <span className="chat-loader-text">AI is thinking</span>
                <div className="chat-loader-animation">
                  <div className="chat-loader-dot"></div>
                  <div className="chat-loader-dot"></div>
                  <div className="chat-loader-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="chat-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <textarea
          className={`chat-input ${loading ? 'loading' : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your message..."
          rows={2}
          disabled={loading}
        />
        <button 
          className={`chat-send-btn ${loading ? 'loading' : ''}`} 
          type="submit" 
          disabled={loading || !input.trim()}
        >
          {loading ? '' : 'Send'}
        </button>
      </form>
      <div className="chat-suggestions">
        <div className="suggestions-title">Try asking:</div>
        <div className="suggestions-list">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className="suggestion-btn"
              onClick={() => sendMessage(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

