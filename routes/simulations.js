import express from "express";
import Simulation from "../models/Simulation.js";
import Client from "../models/Client.js";
import { dniChecker } from "../utils/dniChecker.js";
import { monthlyPayment } from "../utils/mortgageCalculator.js";

const router = express.Router();

// Middleware for validating DNI
const validateDni = (req, res, next) => {
  let dni = "";
  if (req.body.dni) {
    dni = req.body.dni.toUpperCase();
  } else {
    return res.status(400).json({ error: "DNI is required" });
  }

  if (!dni || dni.length !== 9) {
    return res.status(400).json({ error: "DNI must be nine characters long" });
  }

  if (!dniChecker(dni)) {
    return res.status(400).json({ error: "Invalid DNI" });
  }

  next();
};

/**
 * @swagger
 * /api/simulation:
 *   post:
 *     summary: Creates a new loan simulation
 *     description: Create a loan simulation for an existing client.
 *     tags:
 *      - Simulations
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: The DNI of the client to search for in the database
 *                 example: "36300558A"
 *               tae:
 *                 type: number
 *                 description: The Annual Equivalent Rate of the loan
 *                 example: 3.2
 *               term:
 *                 type: integer
 *                 description: The loan term in years
 *                 example: 1
 *     responses:
 *       201:
 *         description: Simulation successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client_id:
 *                   type: string
 *                   example: "36300558A"
 *                 tae:
 *                   type: number
 *                   example: 3.2
 *                 term:
 *                   type: integer
 *                   example: 1
 *                 monthly_payment:
 *                   type: number
 *                   example: 10.43
 *                 total_amount:
 *                   type: number
 *                   example: 125.16
 *       400:
 *         description: Validation or calculation error
 *       404:
 *         description: Client not found
 */
router.post("/simulation", validateDni, async (req, res) => {
  let tae = "";
  let term = "";
  let dni = req.body.dni.toUpperCase();

  if (req.body.tae) {
    tae = parseFloat(req.body.tae);
    if (isNaN(tae)) {
      return res.status(400).json({ error: "TAE must be a number" });
    }
  } else {
    return res.status(400).json({ error: "TAE is required" });
  }

  if (req.body.term) {
    term = parseInt(req.body.term);
    if (isNaN(term)) {
      return res.status(400).json({ error: "Term must be a number" });
    }
  } else {
    return res.status(400).json({ error: "Term is required" });
  }

  const existingClient = await Client.findOne({ where: { dni } });

  if (!existingClient)
    return res.status(404).json({ error: "Client not found" });

  const capital = existingClient.capital;

  const monthly_payment = monthlyPayment(capital, tae, term);
  if (isNaN(monthly_payment))
    return res.status(400).json({ error: "Error calculating monthly payment" });
  const total_amount = monthly_payment * term * 12;

  try {
    const dbSimulation = await Simulation.create({
      client_id: dni,
      tae: tae,
      term: term,
      monthly_payment: monthly_payment,
      total_amount: total_amount,
    });

    const simulation = {
      client_id: dbSimulation.client_id,
      tae: dbSimulation.tae,
      term: dbSimulation.term,
      monthly_payment: dbSimulation.monthly_payment,
      total_amount: dbSimulation.total_amount,
    };

    res.status(201).json(simulation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error creating simulation", details: error });
  }
});

export default router;
