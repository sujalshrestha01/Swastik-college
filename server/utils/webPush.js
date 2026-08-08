import webpush from "web-push";
import Admin from "../models/Admin.js";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

export const pushEnabled = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

if (pushEnabled) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  // Not fatal — the rest of live chat (Socket.io, handoff timers) still
  // works without push configured. Only "notify me when my browser/tab is
  // closed" is unavailable until VAPID keys are set in .env.
  console.warn(
    "[webPush] VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set — admin push notifications are disabled. Run `npx web-push generate-vapid-keys` and add them to server/.env.",
  );
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

// Sends a push notification to every subscription belonging to `admin`.
// Prunes subscriptions the push service reports as gone (410/404) so we
// don't keep retrying a browser that unsubscribed or was uninstalled.
async function sendToAdmin(admin, payload) {
  if (!pushEnabled) return;
  const subs = admin.pushSubscriptions || [];
  if (subs.length === 0) return;

  const deadEndpoints = [];
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
          },
          JSON.stringify(payload),
        );
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          deadEndpoints.push(sub.endpoint);
        } else {
          console.error(
            `[webPush] failed to notify admin ${admin._id}:`,
            err.message,
          );
        }
      }
    }),
  );

  if (deadEndpoints.length > 0) {
    await Admin.findByIdAndUpdate(admin._id, {
      $pull: { pushSubscriptions: { endpoint: { $in: deadEndpoints } } },
    });
  }
}

// Pushes `payload` (title/body/url — kept small, push messages have a size
// limit) to a list of admin documents. Admin docs must include
// pushSubscriptions (it's `select: false` on the schema by default).
export async function notifyAdmins(admins, payload) {
  if (!pushEnabled || !admins?.length) return;
  await Promise.all(admins.map((admin) => sendToAdmin(admin, payload)));
}

// Admins eligible for a push about a NEW escalation: notifications on.
// (Deliberately independent of `available` — an admin who's stepped away
// from taking new chats may still want to know one is waiting.)
export function findNotifiableAdmins() {
  return Admin.find({
    status: "active",
    notificationsEnabled: true,
  }).select("+pushSubscriptions");
}

export function findNotifiableAdminById(id) {
  return Admin.findOne({
    _id: id,
    status: "active",
    notificationsEnabled: true,
  }).select("+pushSubscriptions");
}
