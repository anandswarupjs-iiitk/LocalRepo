const dotenv = require("dotenv");
dotenv.config(); // Must be first — before any module that reads process.env

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Backend running" });
});

// Global error handler must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
