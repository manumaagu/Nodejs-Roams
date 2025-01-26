import express from "express";
import routes from "./routes/index.js";
import { authenticateDb, sequelize } from "./config/db.js";

const app = express();
app.use(express.json());
app.use(routes);

authenticateDb();
sequelize.sync();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
