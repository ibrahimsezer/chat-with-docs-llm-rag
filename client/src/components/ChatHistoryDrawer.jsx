import React, { useState } from "react";

const dummyChats = [
  { id: 1, title: "Döküman Özeti" },
  { id: 2, title: "Yapay Zeka Hakkında" },
  { id: 3, title: "Matematik Sorusu" },
];

const ChatHistoryDrawer = ({ open, onClose }) => {
  const [chats, setChats] = useState(dummyChats);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditValue(title);
  };

  const handleEditSave = (id) => {
    setChats((prev) => prev.map(chat => chat.id === id ? { ...chat, title: editValue } : chat));
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id) => {
    setChats((prev) => prev.filter(chat => chat.id !== id));
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 max-w-full bg-[#18191a] shadow-2xl z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ minWidth: 260 }}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#232323]">
        <span className="text-lg font-bold text-light">Sohbet Geçmişi</span>
        <button onClick={onClose} className="text-secondary hover:text-primary text-2xl font-bold">×</button>
      </div>
      <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
        {chats.length === 0 && (
          <div className="text-secondary text-center mt-8">Hiç sohbet yok.</div>
        )}
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center bg-[#232425]/80 rounded-lg px-3 py-2 group">
            {editingId === chat.id ? (
              <input
                className="flex-1 bg-transparent border-b border-primary text-light px-2 py-1 focus:outline-none"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => setEditingId(null)}
                onKeyDown={e => { if (e.key === 'Enter') handleEditSave(chat.id); }}
                autoFocus
              />
            ) : (
              <span className="flex-1 text-light truncate">{chat.title}</span>
            )}
            {editingId === chat.id ? (
              <button onClick={() => handleEditSave(chat.id)} className="ml-2 text-primary hover:text-light text-lg">✔</button>
            ) : (
              <>
                <button onClick={() => handleEdit(chat.id, chat.title)} className="ml-2 text-secondary hover:text-primary text-lg" title="Düzenle">✎</button>
                <button onClick={() => handleDelete(chat.id)} className="ml-2 text-secondary hover:text-red-500 text-lg" title="Sil">🗑</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryDrawer; 