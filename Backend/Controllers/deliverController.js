import CommunicationLog from "../Models/campaign.js";

export const deliveryReceipt = async (req, res) => {
  try {
    const { campaignId, email, status } = req.body;

    if (!campaignId || !email || !status) {
      return res.status(400).json({ error: "Invalid receipt payload" });
    }

    // // Update campaign log for that email
    // await CommunicationLog.updateOne(
    //   { campaignId, "emails.email": email },
    //   { $set: { "emails.$.status": status } }
    // );

    await CommunicationLog.updateOne(
      { campaignId, "emails.email": email },
      {
        $set: { "emails.$.status": status },
        $inc: {
          sentCount: status === "SENT" ? 1 : 0,
          failedCount: status === "FAILED" ? 1 : 0,
          pendingCount: -1, // reduce pending count once processed
        },
      }
);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
