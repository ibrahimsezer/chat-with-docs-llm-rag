import React, { useRef } from "react";

const UploadButton = ({ onUpload }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = null; // Aynı dosya tekrar seçilirse tetiklenmesi için
  };

  return (
    <button
      type="button"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-2xl mr-2"
      onClick={() => fileInputRef.current.click()}
      title="PDF Yükle"
    >
      +
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </button>
  );
};

export default UploadButton; 