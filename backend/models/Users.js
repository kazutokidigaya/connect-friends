import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications: [
      {
        type: {
          type: String,
          enum: ["friend_request", "friend_accept", "friend_reject"],
        },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema); // Ensure this matches the ref in friends
export default User;
