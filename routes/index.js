import express from "express";
import clientRoutes from "./clients.js"; 
import simulationsRoutes from "./simulations.js";

const router = express.Router();

router.use("/api", clientRoutes);
router.use("/api", simulationsRoutes);

export default router;
