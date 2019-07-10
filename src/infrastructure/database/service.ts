import { Sequelize } from 'sequelize';

export default new Sequelize({
  dialect: 'mariadb',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
});
