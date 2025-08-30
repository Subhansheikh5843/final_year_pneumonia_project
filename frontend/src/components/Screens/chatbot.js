import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../css/ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInfo = localStorage.getItem("userInfo");
    let token = userInfo ? JSON.parse(userInfo).data.token.access : "";

    const newMessages = [...messages, { sender: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/disease/chatbot/",
        { message: input, thread_id: "unique-thread-id" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages([
        ...newMessages,
        { sender: "ai", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-heading">Medical Chatbot</h1>
      <div className="chatbot">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className="loading">Loading...</div>}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
          <button onClick={clearMessages} className="clear-button">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
