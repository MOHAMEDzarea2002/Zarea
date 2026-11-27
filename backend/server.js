// ---- Env first ----
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ---- Trust proxy: ----

app.set("trust proxy", 1);

// ---- CORS ----
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  }),
);

// ---- Middleware ----
app.use(cookieParser());
app.use(express.json());

// ---- Routes ----
const productRouter = require("./routes/products/product");
const categoryRouter = require("./routes/category/category");
const authRouter = require("./routes/auth/auth");
const orderRouter = require("./routes/order/order");
const userRouter = require("./routes/user/user");

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);

// ---- Start server ----
const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
