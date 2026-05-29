import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  contact: { type: String, required: false },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  fullname: { type: String, required: true },
 
  googleId: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
    required: function () {
      return !this.googleId;
    },
  },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
