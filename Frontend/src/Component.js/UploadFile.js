import React, { useState } from "react";
import axios from "axios";
import dataset from '../assets/dataset.png';
import { X } from "lucide-react";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/v1/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setMessage(` Upload successful: ${res.data.message || "File processed"}`);
    } catch (err) {
      setMessage(` Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-6 border rounded-xl shadow-md w-64 bg-white">
      
      <h2 className="text-xl font-semibold">Upload Excel File</h2>
      <p>Add New Customers data into the system</p>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
      <button
        onClick={() => setShowTable(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-slate-800"
      >
        View Sample Data
      </button>
      {
        showTable && 
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50  z-50 flex items-center justify-center" >
          <button className="text-white fixed top-2 right-7" onClick={() => setShowTable(false)} >
                        <X className="w-8 h-8"/>
                    </button>
        <img src={dataset} className="w-full"></img>
        </div>
      }
    </div>
  );
};

export default UploadFile;
