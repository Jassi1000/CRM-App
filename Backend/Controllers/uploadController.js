
import XLSX from "xlsx";
import consumer from "../Models/consumer.js";

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Insert directly into MongoDB
    await consumer.insertMany(data);

    res.json({ message: "Data inserted into DB!", rows: data.length });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process file" });
  }
};
































// import XLSX from "xlsx";
// import Redis from "ioredis";

// const redis = new Redis();
// const STREAM_KEY = "customer_orders_stream";

// export const uploadExcel = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     // Read Excel file
//     const workbook = XLSX.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Convert sheet to JSON
//     const data = XLSX.utils.sheet_to_json(sheet);

//     // Push each row to Redis Stream
//     for (const row of data) {
//       await redis.xadd(STREAM_KEY, "*", "payload", JSON.stringify(row));
//     }

//     res.json({ message: "File processed and data queued!", rows: data.length });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Failed to process file" });
//   }
// };
