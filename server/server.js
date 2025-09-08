import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";

const app = express();
app.use(express.json());

// Дозволяємо запити з фронтенду (Vue локально)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Підключення до PostgreSQL
const pool = new Pool({
  user: "postgres",       // твій користувач PostgreSQL
  host: "localhost",
  database: "mydb",       // база, де є таблиця users
  password: "Pekazu20",// пароль користувача
  port: 5432
});

// Перевірка підключення
pool.query("SELECT 1")
  .then(() => console.log("Підключення до БД успішне!"))
  .catch(err => console.error("Помилка підключення:", err));

// Головна сторінка
app.get("/", (req, res) => {
  res.send("Server працює!");
});

// Маршрут для реєстрації користувача
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username, email",
      [username, email, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server запущено на http://localhost:${PORT}`));

pool.query("SELECT * FROM users LIMIT 1")
  .then(res => console.log("Таблиця users існує:", res.rows))
  .catch(err => console.error("Помилка:", err));

