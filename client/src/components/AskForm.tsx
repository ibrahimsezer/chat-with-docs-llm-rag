import React, { useState } from "react";
import axios from "axios";

const AskForm = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    const doc_id = localStorage.getItem("last_doc_id");
    if (!doc_id) {
      setAnswer("Önce bir PDF yükleyin.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/ask-doc", null, {
        params: { question, doc_id },
        headers: {
          "X-USER-ID": "test-user-frontend",
        },
      });
      setAnswer(response.data.answer);
    } catch (error: any) {
      setAnswer("Sorgu hatası: " + error?.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Soru Sor</h2>
      <input
        type="text"
        placeholder="Belgeye soru sor..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <button
        onClick={handleAsk}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Sor
      </button>
      {answer && <p className="mt-2 text-gray-800 whitespace-pre-wrap">{answer}</p>}
    </div>
  );
};

export default AskForm;
