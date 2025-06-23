import React from "react";

const ChatMessage = ({ message, isUser, time }) => {
  return (
    <div
      className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-move`}
    >
      {!isUser && (
        <div className="flex items-start mr-2">
          <span className="text-primary text-2xl">★</span>
        </div>
      )}
      <div
        className={`rounded-xl px-4 py-3 max-w-[75%] whitespace-pre-line shadow transition-all duration-300 
          ${isUser ? 'bg-primary text-light rounded-br-none' : 'bg-light text-dark rounded-bl-none'}`}
      >
        {message}
        <div className="text-xs text-secondary mt-1 text-right select-none">
          {time}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 