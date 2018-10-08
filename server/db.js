import Sequelize from 'sequelize';

export default new Sequelize({
  dialect: 'mysql',
  host: 'mariadb',
  database: 'bewouterdeschuytertracker',
  username: 'bewouterdeschuytertracker',
  password: 'bewouterdeschuytertracker',
});
