import express from "express";
import session from "express-session";
import passport from "./config/passport.config.js";
import cors from "cors";
import morgan from "morgan";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

// Route import section
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import bookRoute from "./routes/book.route.js";
import reviewRoute from "./routes/review.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import affiliateRoute from "./routes/affiliate.route.js";
import notificationRoute from "./routes/notification.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/review", reviewRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/affiliate", affiliateRoute);
app.use("/api/notifications", notificationRoute);

//404
app.use(notFoundMiddleware);
//ErrorHandling
app.use(errorMiddleware);

export default app;
