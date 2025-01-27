import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import { authenticateDb, sequelize } from "./config/db.js";
import { swaggerDocs } from "./config/swagger.js";

const app = express();
app.use(express.json());
app.use(routes);

authenticateDb();
sequelize.sync();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
