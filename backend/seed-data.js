import pool from './src/db.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('Admin User', 'admin@bringit.com', '9999999999', $1, 'admin')
      ON CONFLICT (email) DO NOTHING
    `, [hashedPassword]);

    // Sample products
    const products = [
      { name: 'Fresh Apples', price: 120, mrp: 150, category: 'fruits', stock: 50, description: 'Fresh red apples', image: '/categories/1.avif' },
      { name: 'Bananas', price: 40, mrp: 50, category: 'fruits', stock: 100, description: 'Ripe yellow bananas', image: '/categories/2.avif' },
      { name: 'Milk 1L', price: 60, mrp: 65, category: 'dairy', stock: 30, description: 'Fresh full cream milk', image: '/categories/3.avif' },
      { name: 'Bread', price: 25, mrp: 30, category: 'bakery', stock: 20, description: 'Fresh white bread', image: '/categories/4.avif' },
    ];

    for (const product of products) {
      await pool.query(`
        INSERT INTO products (name, price, mrp, category, stock, description, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [product.name, product.price, product.mrp, product.category, product.stock, product.description, product.image]);
    }

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();