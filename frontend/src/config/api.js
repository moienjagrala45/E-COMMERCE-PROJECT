/**
 * Centralized API configuration for ShopEase.
 * Automatically targets local backend when running locally or on local Wi-Fi network (LAN),
 * dynamically using the same IP / hostname as the frontend, and Render in production.
 */
export const getApiUrl = (endpoint = "") => {
  let base = "http://localhost:5000";

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Check if running in a local / LAN environment (localhost, 127.0.0.1, or local private IP ranges)
    const isLocalNetwork =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      host.endsWith(".local");

    if (isLocalNetwork) {
      // Use the exact same hostname (e.g. 192.168.0.101 or localhost) with backend port 5000
      base = `http://${host}:5000`;
    } else {
      // Production fallback
      base = "https://e-commerce-project-backend-vpdz.onrender.com";
    }
  }

  if (!endpoint) return base;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};
