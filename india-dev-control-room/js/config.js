/**
 * Dashboard Config
 * ----------------
 * USE_API = false  →  abhi data.js se data lega (jaise abhi chal raha hai)
 * USE_API = true   →  backend API se data lega
 *
 * Jab backend chal raha ho (http://127.0.0.1:8000) tab USE_API = true kar dena.
 */
const CONFIG = {
  USE_API: false,                          // baad mein true karna
  API_BASE: "http://127.0.0.1:8000",       // backend URL
  // Production pe baad mein yeh badlega, jaise:
  // API_BASE: "https://tumhara-backend.railway.app"
};
