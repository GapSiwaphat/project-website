const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const bodyParser = require("body-parser"); 

const fs = require('fs');
const bcrypt = require("bcryptjs");

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
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
//---------------------------register,login-------------------------------//

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query("SELECT id, name, email, password, role FROM User WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = users[0];

    // **ตรวจสอบรหัสผ่านที่เข้ารหัส**
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    res.json({ message: "Login successful", user: { id: user.id, name: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    }

    // เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ใช้ name แทน username
    const sql = "INSERT INTO User (name, email, password) VALUES (?, ?, ?)";
    await db.query(sql, [name, email, hashedPassword]);

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

//----------------------------เเสดงรายการสินค้า-------------------------------//
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
    let categoryId = req.query.category_id;

    let sql = `
      SELECT Product.id, Product.title, Product.description, Product.price, 
             Product.quantity, Product.picture, Product.sold, Product.category_id, 
             COALESCE(Category.name, 'ไม่มีหมวดหมู่') AS category_name
      FROM Product
      LEFT JOIN Category ON Product.category_id = Category.id
    `;

    let values = [];

    if (categoryId && !isNaN(categoryId)) {
      sql += " WHERE Product.category_id = ?";
      values.push(Number(categoryId));
    }

    const [rows] = await db.query(sql, values);
    rows.forEach(product => {
      if (product.picture) {
        product.picture = `http://localhost:3003/uploads/${product.picture}`;
      }
    });

    res.json(rows);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).send('Error fetching products');
  }
});

// ทำการแสดงหมวดหมู่สินค้า
app.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query("SELECT id, name FROM Category");
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Error fetching categories');
  }
});

// อัปเดตสินค้า
app.put('/Product/:id', upload.single('picture'), async (req, res) => {
  const { id } = req.params;
  let { title, description, price, quantity, category_id } = req.body;

  try {
    console.log("Received Data:", req.body);

    // ดึงข้อมูลเก่าของสินค้า
    const [oldData] = await db.query("SELECT * FROM Product WHERE id = ?", [id]);
    if (oldData.length === 0) return res.status(404).send("Product not found");

    const oldProduct = oldData[0];

    // ป้องกันค่าที่เป็น NaN หรือ undefined
    const updatedTitle = title || oldProduct.title;
    const updatedDescription = description || oldProduct.description;
    const updatedPrice = price ? parseFloat(price) : oldProduct.price;
    const updatedQuantity = quantity ? parseInt(quantity, 10) : oldProduct.quantity;
    const updatedPicture = req.file ? req.file.filename : oldProduct.picture;
    const updatedCategory = category_id !== undefined && !isNaN(category_id) ? parseInt(category_id, 10) : oldProduct.category_id;

    console.log("Updating Product:", { updatedTitle, updatedDescription, updatedPrice, updatedQuantity, updatedPicture, updatedCategory });
    const [result] = await db.query(
      "UPDATE Product SET title = ?, description = ?, price = ?, quantity = ?, picture = ?, category_id = ? WHERE id = ?",
      [updatedTitle, updatedDescription, updatedPrice, updatedQuantity, updatedPicture, updatedCategory, id]
    );

    if (result.affectedRows === 0) return res.status(404).send("Product not found");

    // ลบไฟล์รูปเก่าถ้ามีการอัปโหลดรูปใหม่
    if (req.file && oldProduct.picture) {
      const oldFilePath = path.join(__dirname, "uploads", oldProduct.picture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    res.send("Product updated successfully");
  } catch (err) {
    console.error("Error updating product:", err);
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

//---------------ส่วนของตระกร้าสินค้า-------------------------//

// เพิ่มสินค้าลงตระกร้า
app.post("/cart/add", async (req, res) => {
  try {
    const { userId, productId, count, price } = req.body;

    console.log("🛒 Adding product to cart:", req.body);

    if (!userId || !productId || !count || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ ตรวจสอบว่าผู้ใช้มีตะกร้าอยู่หรือยัง
    let [cart] = await db.query("SELECT id FROM Cart WHERE orderedById = ?", [userId]);
    if (cart.length === 0) {
      console.log("🚨 No cart found, creating a new cart...");
      const [newCart] = await db.query(
        "INSERT INTO Cart (cartTotal, createdAt, updatedAt, orderedById) VALUES (0, NOW(), NOW(), ?)",
        [userId]
      );
      cart = [{ id: newCart.insertId }];
    }
    const cartId = cart[0].id; // ✅ ใช้ cartId ที่มีอยู่
    console.log(`✅ Using cartId: ${cartId}`);

    // ✅ ตรวจสอบว่าสินค้าถูกเพิ่มลงในตะกร้าแล้วหรือยัง
    const [existing] = await db.query(
      "SELECT * FROM ProductOnCart WHERE cartId = ? AND productId = ?",
      [cartId, productId]
    );

    if (existing.length > 0) {
      console.log(`🔄 Updating quantity for productId: ${productId}`);
      await db.query(
        "UPDATE ProductOnCart SET count = count + ? WHERE cartId = ? AND productId = ?",
        [count, cartId, productId]
      );
    } else {
      console.log(`➕ Adding new product to cartId: ${cartId}, productId: ${productId}`);
      await db.query(
        "INSERT INTO ProductOnCart (cartId, productId, count, price) VALUES (?, ?, ?, ?)",
        [cartId, productId, count, price]
      );
    }

    res.json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

app.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📌 Fetching cart for userId: ${userId}`);
    
    // ค้นหาตะกร้าของผู้ใช้
    const [cart] = await db.query("SELECT id FROM Cart WHERE orderedById = ?", [userId]);

    if (cart.length === 0) {
      // ถ้าไม่พบ ให้สร้าง Cart ใหม่
      console.log(`🚨 No cart found for userId: ${userId}, creating a new cart...`);
      const [newCart] = await db.query(
        "INSERT INTO Cart (cartTotal, createdAt, updatedAt, orderedById) VALUES (0, NOW(), NOW(), ?)",
        [userId]
      );
      return res.json([]);  // คืนค่าตะกร้าของผู้ใช้เป็น empty array
    }

    const cartId = cart[0].id;
    const [cartItems] = await db.query(
      "SELECT pc.productId, p.title, p.description, p.price, pc.count, p.picture FROM ProductOnCart pc JOIN Product p ON pc.productId = p.id WHERE pc.cartId = ?",
      [cartId]
    );

    console.log("📥 Cart Data Received:", cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error("❌ Failed to fetch cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// อัปเดตจำนวนสินค้าในตะกร้า
app.put('/cart/update', async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    if (count <= 0) {
      await db.query(
        "DELETE FROM ProductOnCart WHERE cartId = (SELECT id FROM Cart WHERE orderedById = ?) AND productId = ?",
        [userId, productId]
      );
    } else {
      await db.query(
        "UPDATE ProductOnCart SET count = ? WHERE cartId = (SELECT id FROM Cart WHERE orderedById = ?) AND productId = ?",
        [count, userId, productId]
      );
    }

    // ✅ อัปเดต `cartTotal`
    await db.query(`
      UPDATE Cart 
      SET cartTotal = (SELECT COALESCE(SUM(pc.count * pc.price), 0) FROM ProductOnCart pc WHERE pc.cartId = (SELECT id FROM Cart WHERE orderedById = ?))
      WHERE orderedById = ?
    `, [userId, userId]);

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

//ลบสินค้าออกจากตะกร้า
app.delete('/cart/remove/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await db.query(
      "DELETE FROM ProductOnCart WHERE cartId = (SELECT id FROM Cart WHERE orderedById = ?) AND productId = ?",
      [userId, productId]
    );

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

//เคลียร์ตะกร้าหลังจากสั่งซื้อ
app.delete('/cart/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    await db.query(
      "DELETE FROM ProductOnCart WHERE cartId = (SELECT id FROM Cart WHERE orderedById = ?)",
      [userId]
    );

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// Route สำหรับดึงราคารวมทั้งหมดของตะกร้า
app.get("/cart/total/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // ตรวจสอบว่าผู้ใช้มีตะกร้าอยู่หรือไม่
    const [cart] = await db.query("SELECT id FROM Cart WHERE orderedById = ?", [userId]);

    if (cart.length === 0) {
      return res.json({ total: 0 }); // หากไม่มีตะกร้าสินค้าให้ส่งผลรวม 0
    }

    const cartId = cart[0].id;

    // คำนวณราคารวมทั้งหมด
    const [total] = await db.query(
      "SELECT SUM(pc.count * pc.price) AS total FROM ProductOnCart pc WHERE pc.cartId = ?",
      [cartId]
    );

    res.json({ total: total[0].total || 0 }); // ส่งกลับผลรวม
  } catch (error) {
    console.error("❌ Error fetching cart total:", error);
    res.status(500).json({ error: "Failed to fetch cart total" });
  }
});


app.post('/order/create', async (req, res) => {
  try {
    const { userId, cartTotal, cartItems } = req.body;

    //สร้างออเดอร์ใหม่
    const [orderResult] = await db.query(
      "INSERT INTO `Order` (orderedById, cartTotal, orderStatus, createdAt, updatedAt) VALUES (?, ?, 'pending', NOW(), NOW())",
      [userId, cartTotal]
    );
    const orderId = orderResult.insertId;

    // เพิ่มสินค้าไปที่ `ProductOnOrder`
    for (const item of cartItems) {
      await db.query(
        "INSERT INTO ProductOnOrder (orderId, productId, count, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.count, item.price]
      );
    }

    res.json({ success: true, orderId });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});



app.listen(3003, () => console.log("Server running "));
