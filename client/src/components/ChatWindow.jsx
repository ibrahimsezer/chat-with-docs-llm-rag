import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import UploadButton from "./UploadButton";

function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Merhaba! Ben SezerMind, kişisel belge okuyucun. Nasıl yardımcı olabilirim?",
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState(localStorage.getItem("last_doc_id") || null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(cooldownRef.current);
  }, [cooldown]);

  const handleSend = async () => {
    if (!input.trim() || cooldown > 0) return;
    if (!docId) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "Önce bir PDF yükleyin.", time: new Date().toISOString() },
      ]);
      setInput("");
      return;
    }
    const now = new Date().toISOString();
    const userMsg = { sender: "user", text: input, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setCooldown(60);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ask-doc",
        null,
        {
          params: { question: input, doc_id: docId },
          headers: { "X-USER-ID": "test-user-frontend" },
        }
      );
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.answer, time: new Date().toISOString() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text:
            "Sorgu hatası: " +
            (error?.response?.data?.detail || error?.message || "Bilinmeyen bir hata oluştu."),
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-USER-ID": "test-user-frontend",
          },
        }
      );
      setDocId(response.data.doc_id);
      localStorage.setItem("last_doc_id", response.data.doc_id);
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: `Yükleme başarılı. (${file.name})\nDOC_ID: ${response.data.doc_id}`,
          time: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text:
            "Yükleme hatası: " +
            (error?.response?.data?.detail || error?.message || "Bilinmeyen bir hata oluştu."),
          time: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 max-w-2xl mx-auto">
      {/* Sohbet geçmişi */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-dark min-h-0">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg.text}
            isUser={msg.sender === "user"}
            time={formatTime(msg.time)}
          />
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Mesaj kutusu ve yükleme */}
      <div className="w-full px-2 pb-6">
        <div className="flex items-center w-full rounded-2xl bg-[#232425]/80 border border-[#444] shadow-md backdrop-blur-md px-3 py-2 relative">
          <UploadButton onUpload={handleUpload} />
          <textarea
            className="flex-1 resize-none bg-transparent text-light placeholder:text-secondary rounded-lg px-2 py-2 focus:outline-none focus:ring-0 border-none text-base min-h-[32px] max-h-32"
            rows={1}
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading || cooldown > 0}
            style={{ transition: 'background 0.2s' }}
          />
          {/* Gönder butonu veya sayaç */}
          {input.trim() ? (
            <div className={`transition-all duration-300 ml-2 ${input.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
              <button
                onClick={handleSend}
                disabled={loading || !input.trim() || cooldown > 0}
                className="bg-primary hover:bg-[#2fa3a8] text-light px-4 py-2 rounded-lg disabled:opacity-50 min-w-[80px] font-semibold shadow-md"
              >
                {cooldown > 0 ? `${cooldown}s` : "Gönder"}
              </button>
            </div>
          ) : (
            cooldown > 0 && (
              <div className="ml-2 min-w-[80px] flex items-center justify-center text-secondary font-semibold animate-pulse select-none">
                {cooldown}s
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 