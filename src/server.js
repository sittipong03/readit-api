import dotenv from "dotenv";
import app from "./app.js";
import shutdown from "./utils/shutdown.util.js";

dotenv.config();

const PORT = process.env.PORT || 8899;

//start server
app.listen(PORT, () => console.log(`Server is running on : ${PORT} PORT`));

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => shutdown("uncaughtException", err));
process.on("unhandledRejection", (err) => shutdown("unhandledRejection", err));
