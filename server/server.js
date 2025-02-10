const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const db = mysql.createPool({
  host: "gapspm.klggm.com",
  user: "klggm_gapspm",
  password: "gapspm@klggm",
  database: "klggm_gapspm"
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// เพิ่มรายการสินค้า
app.post('/Insertproduct', upload.single('picture'), async (req, res) => {
  try {
    console.log(" Received Data:", req.body); 
    let { title, description, price, quantity } = req.body;
    const picture = req.file ? req.file.filename : null;
    // Debug ค่าก่อนแปลง
    console.log("🔍 Before Parsing:", { title, description, price, quantity });
    // แปลงค่าให้เป็นตัวเลข
    quantity = parseInt(quantity, 10);
    price = parseFloat(price);
    // Debug ค่าหลังแปลง
    console.log(" After Parsing:", { title, description, price, quantity });

    if (!title || isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน และ quantity กับ price ต้องเป็นตัวเลข" });
    }

    const sql = "INSERT INTO Product (title, description, price, quantity, picture) VALUES (?, ?, ?, ?, ?)";
    const values = [title, description, price, quantity, picture];

    const [result] = await db.query(sql, values);
    res.json({ message: "Product inserted successfully", insertId: result.insertId });
  } catch (error) {
    console.error("Database insert failed:", error);
    res.status(500).json({ error: "Database insert failed" });
  }
});


// แสดงรายการสินค้า
app.get('/Product', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, title, description, price, quantity, picture, sold FROM Product");
    rows.forEach(product => {
      if (product.picture) {
        product.picture = `http://localhost:3001/uploads/${product.picture}`;
      }
    });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching data');
  }
});

// อัปเดตสินค้า
app.put('/Product/:id', upload.single('picture'), async (req, res) => {
  const { id } = req.params;
  let { title, description, price, quantity } = req.body;

  try {
    console.log("Received Data:", req.body);
    const [oldData] = await db.query("SELECT picture, description, quantity FROM Product WHERE id = ?", [id]);
    if (oldData.length === 0) return res.status(404).send("Product not found");

    const oldPicture = oldData[0].picture;
    const oldDescription = oldData[0].description;
    const oldQuantity = oldData[0].quantity;
    const updatedPicture = req.file ? req.file.filename : oldPicture;
    const updatedQuantity = quantity !== undefined ? parseInt(quantity, 10) : oldQuantity;
    const updatedPrice = price !== undefined ? parseFloat(price) : oldData[0].price;
    const updatedDescription = description !== undefined ? description : oldDescription;

    console.log("✅ Updating Product:", { title, updatedDescription, updatedPrice, updatedQuantity, updatedPicture });

    // อัปเดตข้อมูลในฐานข้อมูล
    const [result] = await db.query(
      "UPDATE Product SET title = ?, description = ?, price = ?, quantity = ?, picture = ? WHERE id = ?",
      [title, updatedDescription, updatedPrice, updatedQuantity, updatedPicture, id]
    );

    if (result.affectedRows === 0) return res.status(404).send("Product not found");

    // ลบรูปเก่าถ้ามีการอัปโหลดรูปใหม่
    if (req.file && oldPicture) {
      const oldFilePath = path.join(__dirname, "uploads", oldPicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.send("Product updated successfully");
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});


// ลบสินค้า
app.delete('/Product/:id', async (req, res) => {
  try {
    const [oldData] = await db.query("SELECT picture FROM Product WHERE id = ?", [req.params.id]);
    const oldPicture = oldData.length ? oldData[0].picture : null;
    
    const [result] = await db.query("DELETE FROM Product WHERE id = ?", [req.params.id]);
    
    if (result.affectedRows && oldPicture) {
      const oldFilePath = path.join(__dirname, "uploads", oldPicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    res.send(result.affectedRows ? "Deleted" : "Product not found");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
