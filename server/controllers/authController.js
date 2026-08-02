import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "12h" },
  );
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    if (admin.status === "pending" || !admin.password) {
      return res
        .status(401)
        .json({ message: "Invite not yet accepted. Check your invite link." });
    }

    const valid = await admin.comparePassword(password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(admin);
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  const admin = await Admin.findById(req.admin.id).select("-password");
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  res.json({ admin });
}

// PUT /api/auth/password
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const valid = await admin.comparePassword(currentPassword);
    if (!valid)
      return res.status(401).json({ message: "Current password is incorrect" });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update password", error: err.message });
  }
}

// POST /api/auth/invite
export async function inviteAdmin(req, res) {
  try {
    if (req.admin.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Only a superadmin can invite new admins" });
    }

    const { name, email, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An admin with this email already exists" });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    const invited = await Admin.create({
      name,
      email: normalizedEmail,
      role: role === "superadmin" ? "superadmin" : "editor",
      status: "pending",
      inviteToken,
      inviteTokenExpires,
    });

    // In production this link would be emailed (e.g. via Nodemailer/SendGrid).
    // For this mockup, it's returned directly so you can test the flow.
    const inviteLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/accept-invite?token=${inviteToken}`;

    res.status(201).json({
      message: "Invite created",
      admin: {
        id: invited._id,
        name: invited.name,
        email: invited.email,
        role: invited.role,
      },
      inviteLink,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create invite", error: err.message });
  }
}

// POST /api/auth/accept-invite
export async function acceptInvite(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const admin = await Admin.findOne({
      inviteToken: token,
      inviteTokenExpires: { $gt: new Date() },
    }).select("+inviteToken +inviteTokenExpires");

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invite link is invalid or has expired" });
    }

    admin.password = password; // hashed automatically by the pre('save') hook
    admin.status = "active";
    admin.inviteToken = undefined;
    admin.inviteTokenExpires = undefined;
    await admin.save();

    const token2 = signToken(admin);
    res.json({
      message: "Account activated",
      token: token2,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to accept invite", error: err.message });
  }
}
