const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup - replace values with your config
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "civicsecure_db",
  password: "123456",
  port: 5432,
});

// Basic route to confirm server is running
app.get("/", (req, res) => {
  res.send("CivicSecure Backend Running");
});

// POST route to add complaint
app.post("/api/complaints", async (req, res) => {
  const { category, description, location, attachments = [], reporter_type = "anonymous" } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO complaints (category, description, location, attachments, reporter_type, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [category, description, location, JSON.stringify(attachments), reporter_type, "submitted"]
    );
    res.status(201).json({ complaint: result.rows[0] });
  } catch (error) {
    console.error("Failed to insert complaint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
