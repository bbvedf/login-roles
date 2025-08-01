const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,       // Este debe ser el nombre del servicio postgres en docker-compose.yml
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
});

module.exports = pool;
