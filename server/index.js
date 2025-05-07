const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "room_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// קריאה לפרוצדורה עם עליית השרת - עדכון צבעים ראשוני
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("CALL update_all_station_colors();");
    conn.release();
    console.log("🎨 הצבעים עודכנו בהצלחה עם עליית השרת.");
  } catch (err) {
    console.error("❌ שגיאה בעדכון צבעים ראשוני:", err);
  }
})();

app.get("/", (req, res) => {
  res.send("🚀 ה־API פעיל! ניתן לבדוק ב־/api/stations");
});

app.get("/api/stations", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id AS station_id,
        s.slot_number,
        s.has_tablet,
        s.has_phone_red,
        s.has_phone_blue,
        s.has_pc_red,
        s.has_pc_blue,
        s.status_colors,
        e.name AS employee_name,
        e.role AS employee_role,
        r.need_tablet,
        r.need_phone_red,
        r.need_phone_blue,
        r.need_pc_red,
        r.need_pc_blue,
        i.supports_tablet,
        i.supports_phone_red,
        i.supports_phone_blue,
        i.supports_pc_red,
        i.supports_pc_blue
      FROM stations s
      LEFT JOIN employees e ON s.assigned_employee_id = e.id
      LEFT JOIN requirements r ON e.needs_id = r.id
      LEFT JOIN infrastructure i ON s.infra_id = i.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("שגיאה בבקשת תחנות:", err);
    res.status(500).json({ error: "שגיאה בקבלת התחנות" });
  }
});

app.post("/api/move", async (req, res) => {
  const { sourceSlot, targetSlot, columnName } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query("CALL move_item_between_stations(?, ?, ?)", [
      sourceSlot,
      targetSlot,
      columnName
    ]);
    conn.release();
    res.json({ success: true });
  } catch (err) {
    console.error("שגיאה בהעברת ציוד:", err);
    res.status(500).json({ error: "שגיאה בהעברת ציוד" });
  }
});

app.listen(3001, () => {
  console.log("🌐 API זמין ב־ http://localhost:3001");
});