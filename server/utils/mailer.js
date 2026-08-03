import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null; // not configured — caller falls back to logging/dev mode
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

/**
 * Sends the admin invite email with the accept-invite link. Returns
 * { sent: true } on success, or { sent: false, reason } if SMTP isn't
 * configured or sending failed — callers should treat `sent: false` as
 * non-fatal (the invite record + link still exist) rather than throwing,
 * so local/dev setups without SMTP configured don't break the invite flow.
 */
export async function sendInviteEmail({ to, name, role, inviteLink }) {
  const transport = getTransporter();
  if (!transport) {
    return {
      sent: false,
      reason:
        "SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing in .env)",
    };
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    await transport.sendMail({
      from: `"Swastik College Admin" <${from}>`,
      to,
      subject: "You've been invited to Swastik College's admin panel",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1E3A8A;">Hi ${name},</h2>
          <p>You've been invited as a <strong>${role}</strong> on the Swastik College admin panel.</p>
          <p>
            <a href="${inviteLink}" style="display:inline-block;background:#D9383A;color:#fff;
               padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Accept Invite &amp; Set Password
            </a>
          </p>
          <p style="color:#64748b;font-size:13px;">
            This link expires in 48 hours and can only be used once.
            If you weren't expecting this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}


/**
 * Sends the password-reset email with the reset link. Same sent/reason
 * contract as sendInviteEmail — non-fatal if SMTP isn't configured.
 */
export async function sendPasswordResetEmail({ to, name, resetLink }) {
  const transport = getTransporter();
  if (!transport) {
    return { sent: false, reason: 'SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing in .env)' };
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    await transport.sendMail({
      from: `"Swastik College Admin" <${from}>`,
      to,
      subject: 'Reset your Swastik College admin password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1E3A8A;">Hi ${name},</h2>
          <p>We received a request to reset the password for your Swastik College admin account.</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;background:#D9383A;color:#fff;
               padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Reset Password
            </a>
          </p>
          <p style="color:#64748b;font-size:13px;">
            This link expires in 1 hour and can only be used once.
            If you didn't request this, you can safely ignore this email — your password won't change.
          </p>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
}