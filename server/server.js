const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "gapspm.klggm.com",
  user: "klggm_gapspm",
  password: "gapspm@klggm",
  database: "klggm_gapspm"
});

// แสดงรายการสินค้า
app.get('/Product', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, title, price, picture, sold FROM Product");
    rows.forEach(product => {
      if (product.picture) {
        product.picture = Buffer.from(product.picture).toString('base64');
      }
    });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching data');
  }
});

// อัปเดตสินค้า
app.put('/Product/:id', async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const [result] = await db.query("UPDATE Product SET title = ?, price = ? WHERE id = ?", [title, price, id]);
    if (result.affectedRows === 0) return res.status(404).send("Product not found");
    res.send("Product updated successfully");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});

// ลบสินค้า
app.delete('/Product/:id', async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Product WHERE id = ?", [req.params.id]);
    res.send(result.affectedRows ? "Deleted" : "Product not found");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
