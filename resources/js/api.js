import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {

        // Token
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Langue
        const locale = localStorage.getItem("app_locale") || "fr";
        config.headers["X-App-Locale"] = locale;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => {

        // Si token expiré
        if (error.response && error.response.status === 401) {

            localStorage.removeItem("access_token");
            localStorage.removeItem("user");

            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default api;