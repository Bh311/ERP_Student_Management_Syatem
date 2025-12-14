import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (options) => {
  return await razorpayInstance.orders.create(options);
};

export const fetchOrderById = async (orderId) => {
  try {
    const order = await razorpayInstance.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error("Error fetching Razorpay order:", error);
    throw new Error("Failed to fetch order details from Razorpay.");
  }
};
