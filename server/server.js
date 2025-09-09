// server.js
import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // для dev: дозволяє всі джерела, в проді вкажи origin

// Підключення до PostgreSQL (через змінні середовища)
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: Number(process.env.DB_PORT || 5432),
    };

const pool = new Pool(poolConfig);

// --- Утиліти ---
const signToken = (payload) => {
  // payload зазвичай { id, email }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "6h" });
};

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No authorization header" });

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ error: "Invalid authorization format" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// --- Маршрути ---

// Health check
app.get("/", (req, res) => res.send("Server працює"));

// REGISTER: хешуємо пароль, вставляємо в БД, повертаємо JWT + profile
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "username, email and password required" });

  try {
    // 1) хеш пароля
    const hash = await bcrypt.hash(password, 12);

    // 2) вставка в БД
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email.toLowerCase(), hash]
    );

    const user = result.rows[0];

    // 3) підписуємо токен
    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({ token, user });
  } catch (err) {
    // handle unique violation (email)
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email or username already exists" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN: знаходимо користувача за email, порівнюємо bcrypt, повертаємо JWT + profile
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  try {
    const result = await pool.query("SELECT id, username, email, password FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    // створюємо токен
    const token = signToken({ id: user.id, email: user.email });

    // не повертаємо password
    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PROTECTED: отримати свій профіль (треба Authorization: Bearer <token>)
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PROTECTED: оновити свій профіль (username, email, password) — password хешується
app.put("/me", authMiddleware, async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;

  try {
    // отримуємо поточні дані
    const curr = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [userId]);
    if (curr.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const newUsername = username ?? curr.rows[0].username;
    const newEmail = email ? email.toLowerCase() : curr.rows[0].email;
    let newPasswordHash = null;

    if (password) {
      newPasswordHash = await bcrypt.hash(password, 12);
      await pool.query(
        "UPDATE users SET username=$1, email=$2, password=$3, updated_at = CURRENT_TIMESTAMP WHERE id=$4",
        [newUsername, newEmail, newPasswordHash, userId]
      );
    } else {
      await pool.query(
        "UPDATE users SET username=$1, email=$2, updated_at = CURRENT_TIMESTAMP WHERE id=$3",
        [newUsername, newEmail, userId]
      );
    }

    const updated = await pool.query("SELECT id, username, email, created_at, updated_at FROM users WHERE id=$1", [userId]);
    return res.json(updated.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email or username already exists" });
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PROTECTED: отримати список усіх користувачів (без паролів) — приклад
app.get("/users", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, created_at FROM users ORDER BY id DESC");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Слухаємо порт
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
