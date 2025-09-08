// server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // дозволяє фронтенду робити запити

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mybd",
  password: "Pekazu20",
  port: 5432,
});

// маршрут для отримання всіх користувачів
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend запущено на http://localhost:3000"));
