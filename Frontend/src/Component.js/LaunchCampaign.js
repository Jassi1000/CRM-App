import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LaunchCampaign = ({ emails }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLaunch = async () => {
    if (!emails || emails.length === 0) {
      setStatus(" No emails selected");
      return;
    }

    setStatus("Sending...");

    try {
      const res = await axios.post(
        "https://crm-backend-bhuu.onrender.com/api/v1/launch-campaign",
        { emails, subject, message },
        { withCredentials: true }
      );
      setStatus(`Sent to ${res.data.sent} customers`);

    } catch (err) {
      setStatus(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubject("");
      setMessage("");
      navigate('/campaigns-history');
    }
  };

  return (
    <div className="p-4 border rounded-lg w-96 mx-auto bg-white shadow-md">
      <h2 className="text-xl font-bold mb-2">Launch Campaign</h2>

      <p className="text-sm mb-2">Segment size: {emails?.length || 0} customers</p>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />

      <textarea
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 rounded w-full h-24 mb-2"
      />

      <button
        onClick={handleLaunch}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-slate-800"
      >
         Launch Campaign
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
};

export default LaunchCampaign;
