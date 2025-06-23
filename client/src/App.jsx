import React from "react";
import UploadForm from "./components/UploadForm";
import AskForm from "./components/AskForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700">Chat with your Documents</h1>
      <UploadForm />
      <AskForm />
    </div>
  );
}

export default App;
