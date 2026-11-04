/** All API calls go through the Express server (see app-studio-server). */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch wrapper: sends cookies (JWT is stored in an HTTPOnly cookie),
 * speaks JSON, and throws readable Errors with the server message.
 */
export async function api(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the StudioSpace server. Please make sure the backend is running and try again."
    );
  }

  // let data = {};
  // try {
  //   data = await response.json();
  // } catch {
  //   data = {};
  // }

  if (!response.ok) {
    const error = new Error(
      data?.error || `Something went wrong (status ${response.status}).`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

/* ---------------------------- Auth ---------------------------- */
export const authApi = {
  me: () => api("/auth/me"),
  register: (payload) => api("/auth/register", { method: "POST", body: payload }),
  login: (payload) => api("/auth/login", { method: "POST", body: payload }),
  google: (credential) =>
    api("/auth/google", { method: "POST", body: { credential } }),
  logout: () => api("/auth/logout", { method: "POST" }),
};

/* -------------------------- Studios --------------------------- */
export const studiosApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, value);
      }
    });
    const qs = query.toString();
    return api(`/studios${qs ? `?${qs}` : ""}`);
  },
  featured: () => api("/studios/featured"),
  mine: (email) => api(`/studios/my?email=${encodeURIComponent(email)}`),
  get: (id) => api(`/studios/${id}`),
  create: (payload) => api("/studios", { method: "POST", body: payload }),
  update: (id, payload) =>
    api(`/studios/${id}`, { method: "PUT", body: payload }),
  remove: (id) => api(`/studios/${id}`, { method: "DELETE" }),
};

/* -------------------------- Bookings -------------------------- */
export const bookingsApi = {
  mine: (email) => api(`/bookings?email=${encodeURIComponent(email)}`),
  create: (payload) => api("/bookings", { method: "POST", body: payload }),
  cancel: (id) => api(`/bookings/${id}/cancel`, { method: "PATCH" }),
};

/* -------------------------- Wishlist -------------------------- */
export const wishlistApi = {
  ids: () => api("/wishlist"),
  studios: () => api("/wishlist/studios"),
  toggle: (studioId) =>
    api(`/wishlist/${studioId}`, { method: "POST" }),
};
