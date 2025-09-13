import { GoogleGenerativeAI } from "@google/generative-ai";
import consumer from "../Models/consumer.js";
import dotenv from "dotenv";
dotenv.config();

// 🔑 Init Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseNLToMongoFilter(naturalLanguageQuery) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a translator that converts natural language customer segmentation rules 
into MongoDB JSON filters. Return ONLY valid JSON, no explanations.

Supported categories:
1. High-value loyalists → { "total_spend": { "$gt": 50000 }, "orders": { "$gt": 10 } }
2. New customers → { "orders": 1, "first_order_date": { "$gt": "DATE_30_DAYS_AGO" } }
3. At-risk churn → { "orders": { "$gte": 3 }, "last_order_date": { "$lt": "DATE_60_DAYS_AGO" } }
4. Cart abandoners → { "cart_items": { "$gt": 0 }, "last_order_date": null, "cart_date": { "$gt": "DATE_7_DAYS_AGO" } }
5. Birthday/anniversary → { "dob_month": "CURRENT_MONTH" }
6. Discount hunters → { "avg_discount": { "$gt": 20 } }
7. Low spenders → { "total_spend": { "$lt": 1000 } }
8. Location-based → { "city": "Delhi", "orders": { "$gte": 2 } }  // city is variable
9. Fast growers → { "avg_order_value_growth": { "$gt": 100 } }
10. Time-of-day shoppers → { "preferred_shopping_time": "night" }

User query: "${naturalLanguageQuery}"
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  console.log("Gemini raw response:", text);

  // Some Gemini responses may wrap JSON in ```json ... ```
  text = text.replace(/```json|```/g, "").trim();
  console.log("Cleaned response:", text);

  let filter = {};
  try {
    filter = JSON.parse(text);

    // 🔁 Handle placeholders dynamically
    const now = new Date();
    const replaceDate = (daysAgo) =>
      new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    if (filter.first_order_date?.["$gt"] === "DATE_30_DAYS_AGO") {
      filter.first_order_date["$gt"] = replaceDate(30);
    }
    if (filter.last_order_date?.["$lt"] === "DATE_60_DAYS_AGO") {
      filter.last_order_date["$lt"] = replaceDate(60);
    }
    if (filter.cart_date?.["$gt"] === "DATE_7_DAYS_AGO") {
      filter.cart_date["$gt"] = replaceDate(7);
    }
    if (filter.dob_month === "CURRENT_MONTH") {
      filter.dob_month = now.getMonth() + 1; // store month as 1-12
    }
    console.log("Final MongoDB filter:", filter);
  } catch (err) {
    throw new Error("Invalid JSON from Gemini: " + err.message + " | Raw: " + text);
  }

  return filter;
}

export async function getEmailsFromNL(naturalLanguageQuery) {
  const filter = await parseNLToMongoFilter(naturalLanguageQuery);
  const results = await consumer.find(filter).select("email -_id");
  return results.map((r) => r.email);
}

export const getSegmentedEmails = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const emails = await getEmailsFromNL(query);
    res.json({ customers: emails, count: emails.length });
    console.log("Segmented emails:", emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





























// import OpenAI from "openai";
// import consumer from "../Models/consumer.js";
// import dotenv from "dotenv";
// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function parseNLToMongoFilter(naturalLanguageQuery) {
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [
//       {
//         role: "system",
//         content: `
// You are a translator that converts natural language customer segmentation rules 
// into MongoDB JSON filters. Return ONLY JSON, no explanations.

// Supported categories:
// 1. High-value loyalists → { "total_spend": { "$gt": 50000 }, "orders": { "$gt": 10 } }
// 2. New customers → { "orders": 1, "first_order_date": { "$gt": "DATE_30_DAYS_AGO" } }
// 3. At-risk churn → { "orders": { "$gte": 3 }, "last_order_date": { "$lt": "DATE_60_DAYS_AGO" } }
// 4. Cart abandoners → { "cart_items": { "$gt": 0 }, "last_order_date": null, "cart_date": { "$gt": "DATE_7_DAYS_AGO" } }
// 5. Birthday/anniversary → { "dob_month": "CURRENT_MONTH" }
// 6. Discount hunters → { "avg_discount": { "$gt": 20 } }
// 7. Low spenders → { "total_spend": { "$lt": 1000 } }
// 8. Location-based → { "city": "Delhi", "orders": { "$gte": 2 } }  // city is variable
// 9. Fast growers → { "avg_order_value_growth": { "$gt": 100 } }
// 10. Time-of-day shoppers → { "preferred_shopping_time": "night" }

// If user query matches one of these, return the appropriate JSON filter.`
//       },
//       {
//         role: "user",
//         content: naturalLanguageQuery
//       }
//     ]
//   });

//   let filter = {};
//   try {
//     filter = JSON.parse(completion.choices[0].message.content);

//     // 🔁 Handle placeholders dynamically
//     const now = new Date();
//     const replaceDate = (daysAgo) => new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

//     if (filter.first_order_date?.["$gt"]?.includes("DATE_30_DAYS_AGO")) {
//       filter.first_order_date["$gt"] = replaceDate(30);
//     }
//     if (filter.last_order_date?.["$lt"]?.includes("DATE_60_DAYS_AGO")) {
//       filter.last_order_date["$lt"] = replaceDate(60);
//     }
//     if (filter.cart_date?.["$gt"]?.includes("DATE_7_DAYS_AGO")) {
//       filter.cart_date["$gt"] = replaceDate(7);
//     }
//     if (filter.dob_month === "CURRENT_MONTH") {
//       filter.dob_month = now.getMonth() + 1; // store month as 1-12
//     }

//   } catch (err) {
//     throw new Error("Invalid JSON from OpenAI: " + err.message);
//   }

//   return filter;
// }

// export async function getEmailsFromNL(naturalLanguageQuery) {
//   const filter = await parseNLToMongoFilter(naturalLanguageQuery);
//   const results = await consumer.find(filter).select("email -_id");
//   return results.map(r => r.email);
// }

// export const getSegmentedEmails = async (req, res) => {
//   try {
//     const { query } = req.body;
//     if (!query) {
//       return res.status(400).json({ error: "Query is required" });
//     }
//     const emails = await getEmailsFromNL(query);
//     res.json({ customers : emails, count: emails.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   } 
// };