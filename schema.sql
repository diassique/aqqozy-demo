-- Create Category table
CREATE TABLE Category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);

-- Create Product table
CREATE TABLE Product (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  priceIsFrom BOOLEAN NOT NULL DEFAULT false,
  imageUrl TEXT NOT NULL,
  categoryId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  status TEXT NOT NULL DEFAULT 'IN_STOCK',
  quantity INTEGER,
  isPublished BOOLEAN NOT NULL DEFAULT true,
  isFeatured BOOLEAN NOT NULL DEFAULT false,
  isNew BOOLEAN NOT NULL DEFAULT true,
  sku TEXT,
  weight REAL,
  dimensions TEXT, -- JSON will be stored as TEXT
  manufacturer TEXT,
  metaTitle TEXT,
  metaDescription TEXT,
  FOREIGN KEY (categoryId) REFERENCES Category(id)
);

-- Create ProductImage table
CREATE TABLE ProductImage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  productId INTEGER NOT NULL,
  order_num INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
);

-- Create Admin table
CREATE TABLE Admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create CompanyInfo table
CREATE TABLE CompanyInfo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telephone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  workSchedule TEXT NOT NULL,
  email TEXT,
  website TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME
);

-- Create indexes
CREATE INDEX idx_product_category ON Product(categoryId);
CREATE INDEX idx_product_status ON Product(status);
CREATE INDEX idx_product_published ON Product(isPublished);
CREATE INDEX idx_product_featured ON Product(isFeatured); 