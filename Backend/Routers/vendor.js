import express from "express";
import axios from "axios";

const vendorRouter = express.Router();

// Vendor API simulates sending with 90% SENT, 10% FAILED
vendorRouter.post("/send", async (req, res) => {
  const { campaignId, email, message } = req.body;

  // Randomly decide status
  const status = Math.random() < 0.9 ? "SENT" : "FAILED";

  // Simulate callback to Delivery Receipt API
  await axios.post("http://localhost:5000/api/v1/delivery-receipt", {
    campaignId,
    email,
    status,
  });

  res.json({ success: true, email, status });
});

export default vendorRouter;
