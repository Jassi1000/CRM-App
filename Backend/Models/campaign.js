
import mongoose from "mongoose";

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  subject: String,
  message: String,
  emails: [
    {
      email: String,
      status: { 
        type: String, 
        enum: ["PENDING", "SENT", "FAILED"], 
        default: "PENDING" 
      },
    },
  ],
  sentCount: { type: Number, default: 0 },    // ✅ total successfully sent
  failedCount: { type: Number, default: 0 },  // ✅ total failed deliveries
  pendingCount: { type: Number, default: 0 }, // ✅ still pending
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CommunicationLog", communicationLogSchema);





// import mongoose from "mongoose";

// const communicationLogSchema = new mongoose.Schema({
//   campaignId: { type: String, required: true },
//   subject: String,
//   message: String,
//   emails: [
//     {
//       email: String,
//       status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("CommunicationLog", communicationLogSchema);


// // models/campaign.js
// import mongoose from "mongoose";

// const campaignSchema = new mongoose.Schema({
//   subject: { type: String, required: true },
//   message: { type: String, required: true },
//   emails: [{ type: String, required: true }],  // all intended recipients

//   sent_count: { type: Number, default: 0 },
//   failed_count: { type: Number, default: 0 },

//   results: [
//     {
//       email: String,
//       status: { type: String, enum: ["SENT", "FAILED"] },
//       error: String, // optional error message if failed
//     },
//   ],

//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Campaign", campaignSchema);
