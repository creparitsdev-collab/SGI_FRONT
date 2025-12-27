import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sgi-back-35cv.onrender.com/api";

const api = axios.create({
  withCredentials: true,
  baseURL,
  timeout: 60000, //60 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  let userObject;

  try {
    userObject = JSON.parse(user);
  } catch (err) {
    console.error("No se pudo parsear `user` desde localStorage:", err);
  }

  if (userObject?.token) {
    config.headers.Authorization = `Bearer ${userObject.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.dispatchEvent(new CustomEvent("sessionExpired"));
    }

    return Promise.reject(error);
  }
);

export { api };
