

import CommunicationLog from "../Models/campaign.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const launchCampaign = async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !emails.length || !message) {
      return res.status(400).json({ error: "Emails list and message are required" });
    }

    // Create campaign entry
    const campaignId = uuidv4();
    const log = await CommunicationLog.create({
      campaignId,
      subject,
      message,
      emails: emails.map((email) => ({ email, status: "PENDING" })),
    });

    // Call vendor API for each email
    for (const email of emails) {
      await axios.post("http://localhost:5000/api/vendor/send", {
        campaignId,
        email,
        message,
      });
    }

    res.json({ success: true, campaignId, total: emails.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await CommunicationLog.find()
      .sort({ createdAt: -1 }) // ✅ most recent first
      .select("campaignId subject createdAt sentCount failedCount emails");

    const formatted = campaigns.map(c => ({
      campaignId: c.campaignId,
      subject: c.subject,
      createdAt: c.createdAt,
      audienceSize: c.emails.length,
      sentCount: c.sentCount,
      failedCount: c.failedCount,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







// // controllers/campaignController.js
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import Campaign from "../Models/campaign.js";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail app password
//   },
// });

// export const launchCampaign = async (req, res) => {
//   try {
//     const { emails, subject, message } = req.body;

//     if (!emails || !emails.length || !message) {
//       return res
//         .status(400)
//         .json({ error: "Emails list and message are required" });
//     }

//     let sent_count = 0;
//     let failed_count = 0;
//     const results = [];

//     for (const email of emails) {
//       try {
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: subject || "Our Latest Campaign 🎉",
//           text: message,
//         });
//         sent_count++;
//         results.push({ email, status: "SENT" });
//       } catch (err) {
//         failed_count++;
//         results.push({ email, status: "FAILED", error: err.message });
//       }
//     }

//     // Save campaign log in DB
//     const campaign = await Campaign.create({
//       subject,
//       message,
//       emails,
//       sent_count,
//       failed_count,
//       results,
//     });

//     res.json({
//       success: true,
//       campaign_id: campaign._id,
//       sent: sent_count,
//       failed: failed_count,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
