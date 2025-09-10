import pool from './src/db.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    const adminResult = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('Admin User', 'admin@bringit.com', '9999999999', $1, 'admin')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, [adminPassword]);

    const userResult = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('John Doe', 'john@example.com', '9876543210', $1, 'customer')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, [userPassword]);

    const user2Result = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('Jane Smith', 'jane@example.com', '9876543211', $1, 'customer')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, [userPassword]);

    // Insert categories
    const categories = [
      { name: 'waterproofing', description: 'Waterproofing solutions and coatings' },
      { name: 'adhesive chemicals', description: 'Adhesives and bonding chemicals' },
      { name: 'tools and machines', description: 'Construction tools and machinery' },
      { name: 'stone polishing', description: 'Stone polishing and finishing products' },
      { name: 'nail/floor/stone protection', description: 'Protection solutions for surfaces' },
      { name: 'epoxy', description: 'Epoxy resins and coatings' },
      { name: 'accessories', description: 'Construction accessories and supplies' },
      { name: 'house maintenance', description: 'General house maintenance products' }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO categories (name, description, image)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=300&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D']);
    }

    // Sample products with new fields
    const products = [
      {
        name: 'Waterproof Coating Pro', brand: 'AquaShield', price: 850, mrp: 1000,
        category: 'waterproofing', batch_no: 'WP001', expiry_date: '2025-12-31',
        description: 'Premium waterproof coating for exterior walls', weight: '5kg',
        sku: 'WP-PRO-5KG', hsn: '32141090', stock: 25,
        sales_prices: JSON.stringify([{quantity: 1, price: 850}, {quantity: 5, price: 800}]),
        images: JSON.stringify([]),
        image: '/uploads/placeholder.png'
      },
      {
        name: 'Tile Adhesive Strong', brand: 'BondMax', price: 320, mrp: 380,
        category: 'adhesive chemicals', batch_no: 'TA002', expiry_date: '2025-06-30',
        description: 'High strength tile adhesive for ceramic tiles', weight: '20kg',
        sku: 'TA-STR-20KG', hsn: '35069190', stock: 40,
        sales_prices: JSON.stringify([{quantity: 1, price: 320}, {quantity: 10, price: 300}]),
        images: JSON.stringify([]),
        image: '/uploads/placeholder.png'
      },
      {
        name: 'Diamond Cutting Blade', brand: 'CutPro', price: 1200, mrp: 1400,
        category: 'tools and machines', batch_no: 'DCB003', expiry_date: null,
        description: 'Professional diamond cutting blade for stone cutting', weight: '500g',
        sku: 'DCB-PRO-12', hsn: '82023100', stock: 15,
        sales_prices: JSON.stringify([{quantity: 1, price: 1200}, {quantity: 3, price: 1100}]),
        images: JSON.stringify([]),
        image: '/uploads/placeholder.png'
      }
    ];

    for (const product of products) {
      await pool.query(`
        INSERT INTO products (
          name, brand, sales_prices, mrp, category, batch_no, expiry_date,
          description, weight, sku, hsn, images, stock, price, image
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT DO NOTHING
      `, [
        product.name, product.brand, product.sales_prices, product.mrp, product.category,
        product.batch_no, product.expiry_date, product.description, product.weight,
        product.sku, product.hsn, product.images, product.stock, product.price, product.image
      ]);
    }

    // Create sample orders
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      const orderResult = await pool.query(`
        INSERT INTO orders (user_id, total, status, payment_status, delivery_address)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
      `, [userId, 1170, 'delivered', 'paid', '123 Main St, City, State 12345']);

      if (orderResult.rows.length > 0) {
        const orderId = orderResult.rows[0].id;
        await pool.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, 1, 1, $2), ($1, 2, 1, $3)
        `, [orderId, 850, 320]);
      }
    }

    console.log('Seed data inserted successfully');
    console.log('Admin login: admin@bringit.com / admin123');
    console.log('User login: john@example.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();