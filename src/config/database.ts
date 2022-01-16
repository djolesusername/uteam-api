import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { ENVIRONMENT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const options: Options = ENVIRONMENT === "development" ?
  {
    dialect: "sqlite",
    storage: 'database.sqlite',
    host: DB_HOST
  } : {
    dialect: "mysql",
    host: DB_HOST
  }

const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  options
);

export default sequelize;
