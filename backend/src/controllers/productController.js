import pool from '../db.js';
import path from 'path';

export const getProducts = async (req, res) => {
  try {
    const { category, categoryId, exclude, limit } = req.query;
    
    let query = 'SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    const params = [];
    const conditions = [];
    
    if (category && category !== 'undefined') {
      conditions.push(`c.name = $${params.length + 1}`);
      params.push(category);
    }
    
    if (categoryId) {
      conditions.push(`p.category_id = $${params.length + 1}`);
      params.push(categoryId);
    }
    
    if (exclude) {
      conditions.push(`p.id != $${params.length + 1}`);
      params.push(exclude);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(limit));
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { 
      name, brand, sales_prices, mrp, category, batch_no, expiry_date,
      description, weight, sku, hsn, stock, price, images
    } = req.body;
    
    let imagePaths = [];
    if (images && Array.isArray(images)) {
      const fs = await import('fs');
      imagePaths = images.map((base64Image, index) => {
        if (base64Image.startsWith('data:image/')) {
          const matches = base64Image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1];
            const data = matches[2];
            const filename = `${Date.now()}-${index}.${ext}`;
            const filepath = `uploads/${filename}`;
            fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
            return `/uploads/${filename}`;
          }
        }
        return base64Image;
      });
    }
    
    const imagePath = imagePaths.length > 0 ? imagePaths[0] : '/uploads/placeholder.png';
    
    const result = await pool.query(
      `INSERT INTO products (
        name, brand, sales_prices, mrp, category, batch_no, expiry_date,
        description, weight, sku, hsn, images, stock, price, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        name, brand, JSON.stringify(sales_prices), mrp, category, batch_no, expiry_date,
        description, weight, sku, hsn, JSON.stringify(imagePaths), stock, price, imagePath
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, brand, sales_prices, mrp, category, batch_no, expiry_date,
      description, weight, sku, hsn, stock, price
    } = req.body;
    
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : undefined;
    const imagePath = images && images.length > 0 ? images[0] : undefined;
    
    let query, values;
    if (images) {
      query = `UPDATE products SET 
        name = $1, brand = $2, sales_prices = $3, mrp = $4, category = $5, 
        batch_no = $6, expiry_date = $7, description = $8, weight = $9, 
        sku = $10, hsn = $11, images = $12, stock = $13, price = $14, image = $15
      WHERE id = $16 RETURNING *`;
      values = [
        name, brand, JSON.stringify(sales_prices), mrp, category, batch_no, expiry_date,
        description, weight, sku, hsn, JSON.stringify(images), stock, price, imagePath, id
      ];
    } else {
      query = `UPDATE products SET 
        name = $1, brand = $2, sales_prices = $3, mrp = $4, category = $5, 
        batch_no = $6, expiry_date = $7, description = $8, weight = $9, 
        sku = $10, hsn = $11, stock = $12, price = $13
      WHERE id = $14 RETURNING *`;
      values = [
        name, brand, JSON.stringify(sales_prices), mrp, category, batch_no, expiry_date,
        description, weight, sku, hsn, stock, price, id
      ];
    }
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY name',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};