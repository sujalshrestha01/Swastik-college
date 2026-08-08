import { getVapidPublicKey, subscribePush, unsubscribePush } from "./client";

export function pushSupported() {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Push subscription keys are base64url — the browser's Push API wants a
// raw Uint8Array, so this converts one to the other.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/service-worker.js");
}

// Requests notification permission, subscribes this browser to push, and
// registers the subscription with the backend against the logged-in admin.
// Returns { ok: true } or { ok: false, reason } so the UI can explain why
// the toggle didn't turn on (e.g. permission denied, push not supported).
export async function enablePushNotifications() {
  if (!pushSupported()) {
    return { ok: false, reason: "not_supported" };
  }

  const { enabled, publicKey } = await getVapidPublicKey();
  if (!enabled || !publicKey) {
    return { ok: false, reason: "not_configured" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "permission_denied" };
  }

  const registration = await registerServiceWorker();
  const ready = await navigator.serviceWorker.ready;

  const existing = await ready.pushManager.getSubscription();
  if (existing) {
    await existing.unsubscribe();
  }
  const subscription = await (registration || ready).pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await subscribePush(subscription.toJSON());
  return { ok: true };
}

export async function disablePushNotifications() {
  if (!pushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await unsubscribePush(subscription.endpoint);
      await subscription.unsubscribe();
    }
  } catch {
    // Best-effort — the server-side notificationsEnabled=false flag is
    // what actually stops pushes from being sent, this just tidies up
    // the browser-side subscription too.
  }
}
