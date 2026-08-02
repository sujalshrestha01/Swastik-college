import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Not required at creation time — an invited admin has no password
    // until they accept the invite and set one.
    password: { type: String, required: false },
    role: { type: String, enum: ["superadmin", "editor"], default: "editor" },
    status: { type: String, enum: ["pending", "active"], default: "active" },
    inviteToken: { type: String, select: false },
    inviteTokenExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Admin", adminSchema);
