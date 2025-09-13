// CampaignHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CampaignHistory = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/campaigns/history", {
          withCredentials: true,
        });
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto mt-6 w-11/12">
      <h1 className="text-2xl font-bold mb-4"> Campaign History</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Campaign ID</th>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Audience Size</th>
            <th className="border px-4 py-2">Sent</th>
            <th className="border px-4 py-2">Failed</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.campaignId}>
              <td className="border px-4 py-2">{c.campaignId}</td>
              <td className="border px-4 py-2">{c.subject}</td>
              <td className="border px-4 py-2">
                {new Date(c.createdAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2">{c.audienceSize}</td>
              <td className="border px-4 py-2 text-green-600">{c.sentCount}</td>
              <td className="border px-4 py-2 text-red-600">{c.failedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignHistory;
