import pool from '../db.js';

export const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    const result = await pool.query(
      'INSERT INTO categories (name, description, image) VALUES ($1, $2, $3) RETURNING *',
      [name, description, image]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};