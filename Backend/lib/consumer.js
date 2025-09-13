// const Redis = require("ioredis");
// const mongoose = require("mongoose");

// const redis = new Redis();
// const STREAM_KEY = "customer_orders_stream";
// const GROUP_NAME = "consumer_group";
// const CONSUMER_NAME = "consumer_1";

// // MongoDB Schema
// mongoose.connect("mongodb://localhost:27017/pubsub_demo");
// const customerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   spend: Number,
// });
// const Customer = mongoose.model("Customer", customerSchema);

// async function createConsumerGroup() {
//   try {
//     await redis.xgroup("CREATE", STREAM_KEY, GROUP_NAME, "0", "MKSTREAM");
//   } catch (err) {
//     if (!err.message.includes("BUSYGROUP")) console.error(err);
//   }
// }

// // Read messages and insert into DB
// async function consume() {
//   while (true) {
//     try {
//       const result = await redis.xreadgroup(
//         "GROUP",
//         GROUP_NAME,
//         CONSUMER_NAME,
//         "COUNT",
//         10,
//         "BLOCK",
//         5000,
//         "STREAMS",
//         STREAM_KEY,
//         ">"
//       );

//       if (!result) continue;

//       for (const [stream, messages] of result) {
//         for (const [id, fields] of messages) {
//           const payload = JSON.parse(fields[1]);

//           // Insert into DB
//           await Customer.create(payload);

//           // Acknowledge message
//           await redis.xack(STREAM_KEY, GROUP_NAME, id);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }
// }

// createConsumerGroup().then(() => {
//   consume();
// });
