import express from "express";
import Client from "../models/Client.js";
import { dniChecker } from "../utils/dniChecker.js";
import validator from "validator";

const router = express.Router();

// Middleware for validating DNI
const validateDni = (req, res, next) => {
  let dni = "";
  if (req.params.dni) {
    dni = req.params.dni.toUpperCase();
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
 * /api/client:
 *   post:
 *     summary: Creates a new client
 *     description: Create a new client in the database
 *     tags:
 *      - Clients
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the client
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email of the client
 *                 example: "johndoe@email.com"
 *               capital:
 *                 type: number
 *                 description: The requested capital of the client
 *                 example: 1000
 *               dni:
 *                 type: string
 *                 description: The DNI of the client
 *                 example: "36300558A"
 *     responses:
 *       201:
 *         description: Client successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 dni:
 *                   type: string
 *                   example: "36300558A"
 *                 email:
 *                   type: string
 *                   example: "johndoe@email.com"
 *                 capital:
 *                   type: number
 *                   example: 1000
 *       400:
 *         description: Validation error bad request
 *       404:
 *         description: Client not found
 */
router.post("/client", async (req, res) => {
  let name = "";
  let email = "";
  let capital = 0;
  let dni = "";

  if (req.body.name) {
    name = req.body.name;
  } else {
    return res.status(400).json({ error: "Name is required" });
  }

  if (typeof name !== "string")
    return res.status(400).json({ error: "Name must be a string" });

  if (req.body.email) {
    email = req.body.email;
  } else {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!validator.isEmail(email))
    return res.status(400).json({ error: "Invalid email" });

  if (req.body.capital) {
    capital = parseFloat(req.body.capital);
    if (isNaN(capital)) {
      return res.status(400).json({ error: "Capital must be a number" });
    }
  } else {
    return res.status(400).json({ error: "Capital is required" });
  }

  if (capital <= 0)
    return res.status(400).json({ error: "Capital must be a positive number" });

  if (req.body.dni) {
    dni = req.body.dni.toUpperCase();
  } else {
    return res.status(400).json({ error: "DNI is required" });
  }

  if (dni.length !== 9)
    return res.status(400).json({ error: "DNI must be nine characters long" });

  if (!dniChecker(dni)) return res.status(400).json({ error: "Invalid DNI" });

  const existingClient = await Client.findOne({ where: { dni } });

  if (existingClient)
    return res.status(400).json({ error: `Client already exists DNI: ${dni}` });

  try {
    const dbClient = await Client.create({ name, dni, email, capital });
    const client = {
      name: dbClient.name,
      dni: dbClient.dni,
      email: dbClient.email,
      capital: dbClient.capital,
    };

    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: "Error creating client", details: error });
  }
});

/**
 * @swagger
 * /api/client/{dni}:
 *   get:
 *     summary: Get client information by DNI
 *     description: Get the information of a client by DNI.
 *     tags:
 *       - Clients
 *     parameters:
 *       - name: dni
 *         in: path
 *         description: The DNI of the client
 *         required: true
 *         schema:
 *           type: string
 *           example: "36300558A"
 *     responses:
 *       200:
 *         description: Client information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 dni:
 *                   type: string
 *                   example: "36300558A"
 *                 email:
 *                   type: string
 *                   example: "johndoe@email.com"
 *                 capital:
 *                   type: number
 *                   example: 1000
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: Client not found
 */
router.get("/client/:dni", validateDni, async (req, res) => {
  const dni = req.params.dni.toUpperCase();

  try {
    const dbClient = await Client.findOne({ where: { dni } });
    if (!dbClient) return res.status(404).json({ error: "Client not found" });

    const client = {
      name: dbClient.name,
      dni: dbClient.dni,
      email: dbClient.email,
      capital: dbClient.capital,
    };

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: "Error fetching client", details: error });
  }
});

/**
 * @swagger
 * /api/client/{dni}:
 *   patch:
 *     summary: Update client information by DNI
 *     description: Update the information of a client by DNI
 *     tags:
 *      - Clients
 *     parameters:
 *       - name: dni
 *         in: path
 *         description: The DNI of the client
 *         required: true
 *         schema:
 *           type: string
 *           example: "36300558A"
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Jane Doe"
 *              email:
 *                type: string
 *                example: "janedoe@email.com"
 *              capital:
 *                type: number
 *                example: 2000
 *     responses:
 *       200:
 *         description: Client information updated successfully
 *       400:
 *         description: Validation error bad request
 *       404:
 *         description: Client not found
 */
router.patch("/client/:dni", validateDni, async (req, res) => {
  const dni = req.params.dni.toUpperCase();

  const allowedFields = ["name", "email", "capital"];
  const updateData = {};

  for (let field in req.body) {
    if (allowedFields.includes(field)) {
      if (field === "capital" && isNaN(parseFloat(req.body[field]))) {
        return res.status(400).json({ error: "Capital must be a number" });
      }
      if (field === "email" && !validator.isEmail(req.body[field])) {
        return res.status(400).json({ error: "Invalid email" });
      }
      updateData[field] = req.body[field];
    } else {
      return res.status(400).json({ error: `Field ${field} is not allowed` });
    }
  }

  try {
    const [updatedRows] = await Client.update(req.body, { where: { dni } });
    if (!updatedRows)
      return res.status(404).json({ error: "Client not found" });

    res
      .status(200)
      .json({ message: "Client information updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating client information", details: error });
  }
});

/**
 * @swagger
 * /api/client/{dni}:
 *   delete:
 *     summary: Delete client by DNI
 *     description: Delete a client by DNI
 *     tags:
 *      - Clients
 *     parameters:
 *       - name: dni
 *         in: path
 *         description: The DNI of the client
 *         required: true
 *         schema:
 *           type: string
 *           example: "36300558A"
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       400:
 *         description: Validation error bad request
 *       404:
 *         description: Client not found
 */
router.delete("/client/:dni", validateDni, async (req, res) => {
  const dni = req.params.dni.toUpperCase();

  try {
    const deletedRows = await Client.destroy({ where: { dni } });
    if (!deletedRows)
      return res.status(404).json({ error: "Client not found" });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting client", details: error });
  }
});

export default router;
