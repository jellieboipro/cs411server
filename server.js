import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

//Create a single shared DB connection
const db = await mysql.createConnection({
  host: '136.114.242.18',
  user: 'root',
  password: 'Koinonia_29.RA',
  database: 'Nature_Navigator',
  ssl: { rejectUnauthorized: false }
});

//Fetch all tables
app.get('/tables', async (req, res) => {
  try {
    const [results] = await db.query('SHOW TABLES');
    const tables = results.map(row => Object.values(row)[0]);
    res.json(tables);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//Fetch specific table data
app.get('/table/:name', async (req, res) => {
  const tableName = req.params.name;
  try {
    const [results] = await db.query(`SELECT * FROM ?? LIMIT 100`, [tableName]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/search", async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Missing name parameter" });

  try {
    const [rows] = await db.query(
      `
      SELECT n.*, w.CommonName, w.ScientificName
      FROM NatureLoggings n
      JOIN WildlifeClassifications w
        ON n.WildlifeId = w.WildlifeId
      WHERE w.CommonName LIKE ?
      LIMIT 100
      `,
      [`%${name}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
app.post('/logs', async (req, res) => {
  const {
    UserId,
    ImageURL,
    Description,
    Latitude,
    Longitude,
    WildlifeId,
    YEAR,
    Month,
    DAY,
    TimeObserved,
    BuildingCode,
    DistanceKM
  } = req.body;

  // Basic validation
  if (!UserId || !WildlifeId || !Latitude || !Longitude) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const sql = `
      INSERT INTO NatureLoggings 
      (UserId, ImageURL, Description, Latitude, Longitude, WildlifeId, YEAR, Month, DAY, TimeObserved, BuildingCode, DistanceKM)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      UserId,
      ImageURL || null,
      Description || null,
      Latitude,
      Longitude,
      WildlifeId,
      YEAR || null,
      Month || null,
      DAY || null,
      TimeObserved || null,
      BuildingCode || null,
      DistanceKM || null
    ];

    const [result] = await db.query(sql, values);

    res.json({
      message: "Entry created successfully",
      LogId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database insertion error" });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
