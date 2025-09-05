import pool from '../db.js';

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    const userId = req.user.id;
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total, delivery_address) VALUES ($1, $2, $3) RETURNING *',
      [userId, total, deliveryAddress]
    );
    
    const order = orderResult.rows[0];
    
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.productId, item.quantity, item.price]
      );
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'productId', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'name', p.name,
               'image', p.image
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};