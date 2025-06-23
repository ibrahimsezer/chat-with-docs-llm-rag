import React from "react";
import ChatWindow from "./components/ChatWindow";
import Header from "./components/Header";

function App() {
  return (
    <div className="w-screen h-screen min-h-0 min-w-0 flex flex-col bg-dark overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center w-full pt-20 pb-4 px-2">
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-end">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}

export default App;
