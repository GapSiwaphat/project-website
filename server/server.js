const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // ต้อง import multer ก่อนใช้งาน
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "gapspm.klggm.com",
    user: "klggm_gapspm",
    password: "gapspm@klggm",
    database: "klggm_gapspm"
});

//แสดงรายการสินค้า
app.get('/Product', (req, res) => {
    db.query("SELECT id, title, description, price, quantity, picture, sold FROM Product", (err, result) => {
        if (err) {
            console.log('Error in query:', err);
            res.status(500).send('Error fetching data');
        } else {
            result.forEach(product => {
                if (product.picture) {
                    product.picture = Buffer.from(product.picture).toString('base64');
                }
            });
            res.json(result);
        }
    });
});

//ฟังก์ชั่นการลบสินค้า
app.delete('/Product/:id', (req, res) => {
    const { id } = req.params;
    
    db.query("DELETE FROM Product WHERE id=?", [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).send('Error deleting product');
        } else {
            res.send({ message: 'Product deleted successfully' });
        }
    });
});

//ฟังก์ชั่นการอัพเดตสินค้า
app.put('/Product/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price, quantity, picture } = req.body;

    const sql = "UPDATE Product SET title=?, description=?, price=?, quantity=?, picture=? WHERE id=?";
    db.query(sql, [title, description, price, quantity, picture, id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).send('Error updating product');
        } else {
            res.send({ message: 'Product updated successfully' });
        }
    });
});

//เพิ่มรายการสินค้า
app.post('/Addproduct', upload.single('picture'), (req, res) => {
    const { title, description, price, quantity } = req.body;
    const picture = req.file ? req.file.buffer.toString('base64') : null; 

    if (!title || !price || !quantity) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const sql = "INSERT INTO Product (title, description, price, quantity, picture) VALUES (?, ?, ?, ?, ?)";
    const values = [title, description, price, quantity, picture];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error inserting product:', err);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มสินค้า" });
        }
        res.status(201).json({ message: "เพิ่มสินค้าสำเร็จ", productId: result.insertId });
    });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
