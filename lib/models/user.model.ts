import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: undefined,
  },
  imageUrl: {
    type: String,
    default: undefined,
  },
  address: {
    streetAddress: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    aptNo: {
      type: String,
      default: "",
    },
  },
  cart: {
    type: [
      {
        meal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Meal",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  verification: {
    code: {
      type: String,
      default: undefined,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});
userSchema.index({ 'verification.code': 1 }, { unique: true, sparse: true });


const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
