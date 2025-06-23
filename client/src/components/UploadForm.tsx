import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "X-USER-ID": "test-user-frontend",
                },
            });

            setMessage(`Yükleme başarılı. DOC_ID: ${response.data.doc_id}`);
            localStorage.setItem("last_doc_id", response.data.doc_id);
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.detail || error?.message || "Bilinmeyen bir hata oluştu.";
            setMessage("Yükleme hatası: " + errorMessage);
        }
    };

    return (
        <div className="bg-white shadow-md p-4 rounded w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">PDF Yükle</h2>
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-2"
            />
            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Yükle
            </button>
            {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
        </div>
    );
};

export default UploadForm;
