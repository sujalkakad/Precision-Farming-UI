// // src/utils/axiosInterceptor.js
// import axios from "axios";

// // Create an Axios instance
// const apiClient = axios.create({
//   baseURL: "http://localhost:5000", // Replace with your API base URL
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage or sessionStorage
//     const token = localStorage.getItem("Authorization"); // Or sessionStorage

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Allow encrypted text if specified
//     if (config.isEncrypted) {
//       config.headers["Content-Type"] = "application/encrypted-text";
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor (Optional: Handle 401 errors)
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("Unauthorized! Redirecting to login...");
//       // Perform logout or redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;




// 7-4-2025 ------------------------------------------------------------------------


// utils/axiosInterceptor.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // ✅ Must match backend
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
