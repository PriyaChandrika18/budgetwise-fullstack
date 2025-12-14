import React, { useState } from "react";
import axios from "axios";
import "./AIChatbot.css";

function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat([...chat, userMsg]);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/ai/chat",
        { message: message }
      );

      const aiMsg = {
        sender: "ai",
        text: response.data
      };

      setChat(prev => [...prev, aiMsg]);
    } catch (error) {
      setChat(prev => [
        ...prev,
        { sender: "ai", text: "AI server error 😢" }
      ]);
    }

    setMessage("");
  };

  return (
    <>
      <button className="chat-btn" onClick={() => setOpen(!open)}>
        🤖 AI
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            BudgetWise AI
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {chat.map((c, i) => (
              <div
                key={i}
                className={c.sender === "user" ? "user-msg" : "ai-msg"}
              >
                {c.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={message}
              placeholder="Ask about savings..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
