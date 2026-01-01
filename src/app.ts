import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3222",
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());

import routes from "./routes/index.js";

app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({ message: "Misu Optics API is running" });
});

export default app;
