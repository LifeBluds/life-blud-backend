import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { allowedOrigins, connectDB, isLocal } from "./config";
import { AppResponse } from "./utils";
import Http from "./constants/statusCodes";
import { authRoute } from "./routes";

const app: Express = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// Define Routes
app.use("/api/auth", authRoute);

app.get("/", (_req: Request, res: Response) => {
  return AppResponse(res, Http.OK, null, "Server is up and running lfg 🚀🚀", true);
});

app.get("/health", (_req: Request, res: Response) => {
  return AppResponse(
    res,
    Http.OK,
    null,
    "Server is healthy and running smoothly 🏃🏾🏃🏾",
    true,
  );
});

// 404 Route
app.all("*", (_req: Request, res: Response) => {
  return AppResponse(
    res,
    Http.NOT_FOUND,
    null,
    "Route does not exist, check provided endpoint and try again",
    false,
  );
});

const startServer = async () => {
  try {
    // DB Config
    await connectDB();
    app.listen(PORT, () => {
      isLocal
        ? console.info(`Server running on http://localhost:${PORT}`)
        : console.info(`Server running on prod`);
    });
  } catch (err: any) {
    console.error(`Failed to connect to the database: ${err.message}`);
    process.exit(1);
  }
};

startServer();
