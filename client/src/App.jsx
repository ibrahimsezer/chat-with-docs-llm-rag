import React from "react";
import ChatWindow from "./components/ChatWindow";
import sezermindLogo from "./assets/logos/sezermind_banner_logo.png";

function App() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <img src={sezermindLogo} alt="SezerMind Logo" className="max-w-full h-48 mx-auto mb-6" />
      <ChatWindow />
    </div>
  );
}

export default App;
