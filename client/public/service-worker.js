// Runs independently of any open tab. Chrome/Edge/Firefox keep this
// registered in the background so a push can wake it and show a
// notification even when the site isn't open at all.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "New message", body: "You have a new update." };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // Non-JSON payload — fall back to the default text above.
  }

  const url = data.conversationId
    ? `/admin/live-chat?conversation=${data.conversationId}`
    : "/admin/live-chat";

  event.waitUntil(
    self.registration.showNotification(data.title || "New message", {
      body: data.body || "",
      icon: "/swastik logo.png",
      badge: "/swastik logo.png",
      tag: data.conversationId || "swastik-admin-chat",
      renotify: true,
      data: { url },
    }),
  );
});

// Clicking the OS notification focuses an already-open admin tab if one
// exists, otherwise opens a new one straight to the conversation.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/admin/live-chat";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes("/admin") && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
