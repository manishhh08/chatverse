const apiUrl =
  (window.location.hostname === "localhost"
    ? import.meta.env.VITE_APP_API_URL_LOCAL
    : import.meta.env.VITE_APP_API_URL_PROD) + "/api/v1";

export default apiUrl;
