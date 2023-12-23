import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    quantity: { type: Number, default: 1 },
  }],
  totalAmount: { type: Number, required: true },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
