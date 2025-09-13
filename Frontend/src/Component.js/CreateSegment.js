import React, { useState } from "react";
import axios from "axios";
import LaunchCampaign from "./LaunchCampaign";
import { X } from "lucide-react";

const CreateSegment = () => {
  const [segmentText, setSegmentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async () => {
    if (!segmentText.trim()) {
      setMessage("Please enter a segment rule");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/api/v1/createSegment",
        { query: segmentText },
        {
          headers: {
            "Content-Type": "application/json",
            // For JWT auth
            // "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // for cookie/session auth
        }
      );
      console.log("Segment Response:", res);
      console.log("Customers:", res.data.customers);
      setResults(res.data.customers || []);
      setMessage(" Segment processed successfully");
    } catch (err) {
      setMessage(`Failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  gap-4 p-6 ">
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-3 p-6 border rounded-xl shadow-md w-[500px] bg-white">
      <h2 className="text-xl font-semibold">Create Audience Segment</h2>
      <textarea
        rows={4}
        value={segmentText}
        onChange={(e) => setSegmentText(e.target.value)}
        placeholder='e.g. "Customers who spent more than ₹50,000 and placed more than 10 orders"'
        className="w-full border rounded-lg p-2 text-sm"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      <div>
      {message && <p className="text-sm mt-2">{message}</p>}
      {results.length > 0 && <button
        onClick={() => setShowResults(!showResults)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-slate-800 text-sm" >
        {showResults ? "Hide" : "Show"} Matching Customers  {results.length} 
      </button>}
      </div>
      </div>
      
      {results.length > 0 && showResults && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 py-10 z-50 flex flex-col items-center justify-center" >
          <button className="text-white fixed top-2 right-7" onClick={() => setShowResults(false)} >
                        <X className="w-8 h-8"/>
                    </button>
        <h3 className="font-medium text-white">📋 Matching Customers: {results.length}</h3>
        <div className="mt-4 w-full h-5/6  overflow-y-auto flex items-center justify-center  " >
          <div className="h-full pl-6 text-sm  ">
            {results.map((c) => (
              <p key={c} className="text-white mb-1">
                {c}
              </p>
            ))}
            {/* {results.map((c) => (
              <li key={c.email}>
                {c.name} ({c.email})
              </li>
            ))} */}
          </div>
          
        </div>
        </div>

      )}
      </div>
      {
        results.length > 0 && <LaunchCampaign emails={results}/>
      }
    </div>
  );
};

export default CreateSegment;
