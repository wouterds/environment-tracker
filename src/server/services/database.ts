import { config } from 'dotenv';
import * as sequelize from 'sequelize';

config();

export default new sequelize({
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
});
