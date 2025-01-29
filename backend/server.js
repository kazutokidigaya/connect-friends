import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is up and running!" });
});

// Self-Pinging to Keep Server Active
const pingServer = () => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  setInterval(
    async () => {
      try {
        console.log(`Pinging server: ${serverUrl}`);
        await axios.get(serverUrl);
      } catch (error) {
        console.error(`Error pinging server: ${error.message}`);
      }
    },
    5 * 60 * 1000
  ); // Ping every 5 minutes
};

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const HOST = "0.0.0.0"; // Bind to all interfaces for Render
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDb();
    pingServer(); // Start the self-pinging function
  });
  server.keepAliveTimeout = 120000; // 2 minutes
  server.headersTimeout = 120000; // 2 minutes
}
