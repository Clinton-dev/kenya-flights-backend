import { Router } from "express";
import {searchFlights} from "../controllers/flighsController.js";

const router = Router();

router.post("/", searchFlights);

export default router;
