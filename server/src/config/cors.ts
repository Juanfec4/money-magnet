import { Router } from "express";
import cors from "cors";

const middleware = Router();

middleware.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["authorization"],
  })
);

export default middleware;
