import mongoose from "mongoose";

const chattySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firebaseUid: { type: String, required: true },
    provider: { type: String, required: true },
    displayName: { type: String },
    email: { type: String, required: true },
    photoURL: { type: String },
    lastLogin: { type: Date, default: Date.now },
    // Add more fields as needed
  },
  { timestamps: true }
);

const Chatty = mongoose.model("Chatty", chattySchema);

export default Chatty;
