import pool from './src/db.js';

const products = [
  { name: 'Fresh Apples', price: 120, mrp: 150, category: 'fruits', stock: 50, description: 'Fresh red apples from Kashmir', image: '/categories/1.avif' },
  { name: 'Bananas', price: 40, mrp: 50, category: 'fruits', stock: 100, description: 'Ripe yellow bananas', image: '/categories/2.avif' },
  { name: 'Milk 1L', price: 60, mrp: 65, category: 'dairy', stock: 30, description: 'Fresh full cream milk', image: '/categories/3.avif' },
  { name: 'Bread', price: 25, mrp: 30, category: 'bakery', stock: 20, description: 'Fresh white bread', image: '/categories/4.avif' },
  { name: 'Tomatoes', price: 30, mrp: 40, category: 'vegetables', stock: 80, description: 'Fresh red tomatoes', image: '/categories/5.webp' },
  { name: 'Onions', price: 25, mrp: 35, category: 'vegetables', stock: 60, description: 'Fresh onions', image: '/categories/6.avif' },
  { name: 'Potatoes', price: 20, mrp: 25, category: 'vegetables', stock: 100, description: 'Fresh potatoes', image: '/categories/7.avif' },
  { name: 'Yogurt', price: 45, mrp: 50, category: 'dairy', stock: 25, description: 'Fresh yogurt', image: '/categories/8.avif' },
  { name: 'Cheese', price: 180, mrp: 200, category: 'dairy', stock: 15, description: 'Fresh cheese slices', image: '/categories/9.avif' },
  { name: 'Oranges', price: 80, mrp: 100, category: 'fruits', stock: 40, description: 'Fresh oranges', image: '/categories/10.avif' },
];

const insertProducts = async () => {
  try {
    for (const product of products) {
      await pool.query(`
        INSERT INTO products (name, price, mrp, category, stock, description, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [product.name, product.price, product.mrp, product.category, product.stock, product.description, product.image]);
    }
    console.log('Products inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting products:', error);
    process.exit(1);
  }
};

insertProducts();