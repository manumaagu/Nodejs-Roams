import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Simulation = sequelize.define("Simulation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  client_id: {
    type: DataTypes.STRING(9),
    allowNull: false,
  },
  tae: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  term: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  monthly_payment: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Simulation;
