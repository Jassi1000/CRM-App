import mongoose from "mongoose";

const consumerSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String }, // optional

  // Orders & Spending
  orders: { type: Number, default: 0 },               // total number of orders
  total_spend: { type: Number, default: 0 },          // total money spent
  avg_order_value: { type: Number, default: 0 },      // average order value
  avg_order_value_growth: { type: Number, default: 0 }, // growth % in last 3 months
  avg_discount: { type: Number, default: 0 },         // average discount %

  // Dates
  first_order_date: { type: Date, default: null },   // null if no orders
  last_order_date: { type: Date, default: null },    // null if no orders
  dob: { type: Date, default: null },               // date of birth
  dob_month: { 
    type: Number, 
    default: function() {
      return this.dob ? this.dob.getMonth() + 1 : null; // 1-12 if dob exists
    }
  },
  anniversary_date: { type: Date, default: null },   // optional

  // Cart info
  cart_items: { type: Number, default: 0 },          // items in cart
  cart_date: { type: Date, default: null },          // only set if cart_items > 0

  // Location
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: "India" },

  // Preferences
  preferred_shopping_time: { 
    type: String, 
    enum: ["morning", "afternoon", "evening", "night"], 
    default: null 
  },

  // Precomputed Loyalty / Segmentation Flags
  is_vip: { type: Boolean, default: false },          // high-value loyalists
  at_risk: { type: Boolean, default: false },        // at-risk churn
  low_spender: { type: Boolean, default: false },    // total spend < 1,000
  cart_abandoner: { type: Boolean, default: false }, // cart_items > 0 but no order

}, { timestamps: true });

export default mongoose.model("Consumer", consumerSchema);

