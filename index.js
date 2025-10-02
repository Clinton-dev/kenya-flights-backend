import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flightsRouter from "./src/routes/flights.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { logger } from "./src/middleware/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/searchFlights", flightsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
});
