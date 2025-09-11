import pool from './src/db.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    const adminResult = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('Admin User', 'admin@saras.com', '9999999999', $1, 'admin')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, [adminPassword]);

    const userResult = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('John Doe', 'john@example.com', '9876543210', $1, 'customer')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, [userPassword]);

    const user2Result = await pool.query(`
      INSERT INTO users (name, email, phone, password, role) 
      VALUES ('Jane Smith', 'test@test.com', '9876543211', $1, 'customer')
      ON CONFLICT (email) DO NOTHING RETURNING id
    `, ['test123']);

    // Insert categories and get theiuserPasswordr IDs
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

    const categoryIds = {};
    for (const category of categories) {
      const result = await pool.query(`
        INSERT INTO categories (name, description, image)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET description = $2, image = $3
        RETURNING id, name
      `, [category.name, category.description, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=300&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D']);
      
      if (result.rows.length === 0) {
        const existingResult = await pool.query('SELECT id, name FROM categories WHERE name = $1', [category.name]);
        categoryIds[category.name] = existingResult.rows[0].id;
      } else {
        categoryIds[category.name] = result.rows[0].id;
      }
    }

    // Sample products with category IDs
    const products = [
      // Waterproofing Products
      {
        name: 'Waterproof Coating Pro', brand: 'AquaShield', price: 850, mrp: 1000,
        category_id: categoryIds['waterproofing'], batch_no: 'WP001', expiry_date: '2025-12-31',
        description: 'Premium waterproof coating for exterior walls', weight: '5kg',
        sku: 'WP-PRO-5KG', hsn: '32141090', stock: 25,
        sales_prices: JSON.stringify([{quantity: 1, price: 850}, {quantity: 5, price: 800}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Liquid Membrane Sealant', brand: 'AquaShield', price: 650, mrp: 750,
        category_id: categoryIds['waterproofing'], batch_no: 'WP002', expiry_date: '2025-08-15',
        description: 'Flexible liquid membrane for roof waterproofing', weight: '4kg',
        sku: 'LMS-4KG', hsn: '32141090', stock: 30,
        sales_prices: JSON.stringify([{quantity: 1, price: 650}, {quantity: 4, price: 600}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Bitumen Primer', brand: 'SealTech', price: 280, mrp: 320,
        category_id: categoryIds['waterproofing'], batch_no: 'WP003', expiry_date: '2025-10-20',
        description: 'High-quality bitumen primer for surface preparation', weight: '1kg',
        sku: 'BP-1KG', hsn: '32141090', stock: 50,
        sales_prices: JSON.stringify([{quantity: 1, price: 280}, {quantity: 10, price: 260}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // Adhesive Chemicals
      {
        name: 'Tile Adhesive Strong', brand: 'BondMax', price: 320, mrp: 380,
        category_id: categoryIds['adhesive chemicals'], batch_no: 'TA002', expiry_date: '2025-06-30',
        description: 'High strength tile adhesive for ceramic tiles', weight: '20kg',
        sku: 'TA-STR-20KG', hsn: '35069190', stock: 40,
        sales_prices: JSON.stringify([{quantity: 1, price: 320}, {quantity: 10, price: 300}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Marble Adhesive Premium', brand: 'BondMax', price: 450, mrp: 520,
        category_id: categoryIds['adhesive chemicals'], batch_no: 'MA001', expiry_date: '2025-09-15',
        description: 'Premium adhesive for marble and natural stone', weight: '25kg',
        sku: 'MA-PREM-25KG', hsn: '35069190', stock: 20,
        sales_prices: JSON.stringify([{quantity: 1, price: 450}, {quantity: 5, price: 420}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Wood Glue Industrial', brand: 'StickFast', price: 180, mrp: 220,
        category_id: categoryIds['adhesive chemicals'], batch_no: 'WG001', expiry_date: '2025-07-10',
        description: 'Industrial grade wood adhesive', weight: '1kg',
        sku: 'WG-IND-1KG', hsn: '35069190', stock: 35,
        sales_prices: JSON.stringify([{quantity: 1, price: 180}, {quantity: 12, price: 160}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // Tools and Machines
      {
        name: 'Diamond Cutting Blade', brand: 'CutPro', price: 1200, mrp: 1400,
        category_id: categoryIds['tools and machines'], batch_no: 'DCB003', expiry_date: null,
        description: 'Professional diamond cutting blade for stone cutting', weight: '500g',
        sku: 'DCB-PRO-12', hsn: '82023100', stock: 15,
        sales_prices: JSON.stringify([{quantity: 1, price: 1200}, {quantity: 3, price: 1100}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Angle Grinder 850W', brand: 'PowerTool', price: 2800, mrp: 3200,
        category_id: categoryIds['tools and machines'], batch_no: 'AG001', expiry_date: null,
        description: 'Heavy duty angle grinder with variable speed', weight: '2.5kg',
        sku: 'AG-850W', hsn: '84672900', stock: 8,
        sales_prices: JSON.stringify([{quantity: 1, price: 2800}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Drill Bit Set HSS', brand: 'DrillMaster', price: 450, mrp: 550,
        category_id: categoryIds['tools and machines'], batch_no: 'DBS001', expiry_date: null,
        description: '13-piece HSS drill bit set for metal and wood', weight: '800g',
        sku: 'DBS-HSS-13PC', hsn: '82077000', stock: 25,
        sales_prices: JSON.stringify([{quantity: 1, price: 450}, {quantity: 5, price: 400}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // Stone Polishing
      {
        name: 'Marble Polish Compound', brand: 'ShineBright', price: 380, mrp: 450,
        category_id: categoryIds['stone polishing'], batch_no: 'MPC001', expiry_date: '2025-11-30',
        description: 'Professional marble polishing compound', weight: '2kg',
        sku: 'MPC-2KG', hsn: '34054000', stock: 18,
        sales_prices: JSON.stringify([{quantity: 1, price: 380}, {quantity: 6, price: 350}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Diamond Polishing Pad Set', brand: 'PolishPro', price: 850, mrp: 1000,
        category_id: categoryIds['stone polishing'], batch_no: 'DPP001', expiry_date: null,
        description: '7-piece diamond polishing pad set for stone', weight: '1.2kg',
        sku: 'DPP-7PC', hsn: '68042200', stock: 12,
        sales_prices: JSON.stringify([{quantity: 1, price: 850}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // Epoxy Products
      {
        name: 'Epoxy Resin Clear', brand: 'ResinCraft', price: 1200, mrp: 1400,
        category_id: categoryIds['epoxy'], batch_no: 'ERC001', expiry_date: '2025-12-15',
        description: 'Crystal clear epoxy resin for coating and casting', weight: '1kg',
        sku: 'ERC-CLEAR-1KG', hsn: '39073000', stock: 22,
        sales_prices: JSON.stringify([{quantity: 1, price: 1200}, {quantity: 3, price: 1100}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Epoxy Floor Coating', brand: 'FloorTech', price: 2200, mrp: 2600,
        category_id: categoryIds['epoxy'], batch_no: 'EFC001', expiry_date: '2025-08-20',
        description: 'Industrial grade epoxy floor coating', weight: '5kg',
        sku: 'EFC-5KG', hsn: '39073000', stock: 10,
        sales_prices: JSON.stringify([{quantity: 1, price: 2200}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // Accessories
      {
        name: 'Safety Goggles Pro', brand: 'SafeGuard', price: 120, mrp: 150,
        category_id: categoryIds['accessories'], batch_no: 'SG001', expiry_date: null,
        description: 'Anti-fog safety goggles with UV protection', weight: '150g',
        sku: 'SG-PRO', hsn: '90049000', stock: 45,
        sales_prices: JSON.stringify([{quantity: 1, price: 120}, {quantity: 10, price: 100}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Work Gloves Heavy Duty', brand: 'GripMax', price: 85, mrp: 110,
        category_id: categoryIds['accessories'], batch_no: 'WG001', expiry_date: null,
        description: 'Heavy duty work gloves with grip coating', weight: '200g',
        sku: 'WG-HD-L', hsn: '61169300', stock: 60,
        sales_prices: JSON.stringify([{quantity: 1, price: 85}, {quantity: 12, price: 75}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      
      // House Maintenance
      {
        name: 'Wall Putty White', brand: 'WallCare', price: 280, mrp: 320,
        category_id: categoryIds['house maintenance'], batch_no: 'WP001', expiry_date: '2025-09-30',
        description: 'Premium white wall putty for smooth finish', weight: '20kg',
        sku: 'WP-WHITE-20KG', hsn: '32149000', stock: 35,
        sales_prices: JSON.stringify([{quantity: 1, price: 280}, {quantity: 10, price: 260}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      },
      {
        name: 'Acrylic Emulsion Paint', brand: 'ColorMax', price: 650, mrp: 750,
        category_id: categoryIds['house maintenance'], batch_no: 'AEP001', expiry_date: '2025-10-15',
        description: 'Premium acrylic emulsion paint for interior walls', weight: '4L',
        sku: 'AEP-4L', hsn: '32100000', stock: 28,
        sales_prices: JSON.stringify([{quantity: 1, price: 650}, {quantity: 4, price: 600}]),
        images: JSON.stringify([]), image: '/uploads/placeholder.png'
      }
    ];

    for (const product of products) {
      // Get category name for the product
      const categoryResult = await pool.query('SELECT name FROM categories WHERE id = $1', [product.category_id]);
      const categoryName = categoryResult.rows[0]?.name || 'unknown';
      
      await pool.query(`
        INSERT INTO products (
          name, brand, sales_prices, mrp, category_id, category, batch_no, expiry_date,
          description, weight, sku, hsn, images, stock, price, image
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (name) DO NOTHING
      `, [
        product.name, product.brand, product.sales_prices, product.mrp, product.category_id, categoryName,
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
    console.log('Admin login: admin@Saras.com / admin123');
    console.log('User login: john@example.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();