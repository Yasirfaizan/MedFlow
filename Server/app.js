const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
} catch (err) {
  console.warn("Could not set DNS servers, using system default:", err.message);
}

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://med-flow-two-livid.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/patients", require("./routes/patient.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/prescriptions", require("./routes/prescription.routes"));
app.use("/api/ai", require("./routes/ai.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Clinic Management API is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
