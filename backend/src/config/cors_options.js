const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://chat-app-9u1r.onrender.com",
];

const cors_options = {
  origin: (origin, callBack) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callBack(null, true);
    } else {
      callBack(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};

module.exports = cors_options;
