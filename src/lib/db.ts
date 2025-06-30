import { turso } from './turso';
import { nanoid } from 'nanoid';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  priceIsFrom: boolean;
  imageUrl: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  quantity: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sku: string | null;
  weight: number | null;
  dimensions: string | null;
  manufacturer: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  images?: ProductImage[];
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
  order_num: number;
  createdAt: string;
}

export interface Admin {
  id: number;
  email: string;
  password: string;
  createdAt: string;
}

export interface CompanyInfo {
  id: number;
  telephone: string;
  whatsapp: string;
  address: string;
  workSchedule: string;
  email: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  const { rows } = await turso.execute('SELECT * FROM Category ORDER BY name');
  return rows as unknown as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Category WHERE slug = ?',
    args: [slug]
  });
  return rows.length > 0 ? (rows[0] as unknown as Category) : null;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Category WHERE id = ?',
    args: [id]
  });
  return rows.length > 0 ? (rows[0] as unknown as Category) : null;
}

export async function createCategory(data: { name: string; description?: string }): Promise<Category> {
  const slug = data.name.toLowerCase().replace(/\s+/g, '-');
  const { rows } = await turso.execute({
    sql: `INSERT INTO Category (name, slug, description, createdAt, updatedAt) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
    args: [data.name, slug, data.description || null]
  });
  return rows[0] as unknown as Category;
}

export async function updateCategory(id: number, data: Partial<Omit<Category, 'id' | 'slug'>>): Promise<Category | null> {
  const fieldsToUpdate = { ...data };
  if ('name' in data && data.name) {
    (fieldsToUpdate as Partial<Category>).slug = data.name.toLowerCase().replace(/\s+/g, '-');
  }

  const fields = Object.keys(fieldsToUpdate)
    .map(key => `"${key}" = ?`)
    .join(', ');
  const values = Object.values(fieldsToUpdate);

  if (values.length === 0) {
    return getCategoryById(id);
  }
  
  const { rows } = await turso.execute({
    sql: `UPDATE Category SET ${fields}, "updatedAt" = CURRENT_TIMESTAMP 
     WHERE id = ? RETURNING *`,
    args: [...values, id]
  });
  
  return rows.length > 0 ? (rows[0] as unknown as Category) : null;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { rowsAffected } = await turso.execute({
    sql: 'DELETE FROM Category WHERE id = ?',
    args: [id]
  });
  return rowsAffected > 0;
}

// Product operations
export async function getAllProducts(): Promise<Product[]> {
  const { rows } = await turso.execute(`
    SELECT * FROM Product 
    ORDER BY createdAt DESC
  `);
  return rows as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Product WHERE slug = ?',
    args: [slug]
  });
  return rows.length > 0 ? (rows[0] as unknown as Product) : null;
}

export async function getProductImages(productId: number): Promise<ProductImage[]> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM ProductImage WHERE productId = ? ORDER BY order_num',
    args: [productId]
  });
  return rows as unknown as ProductImage[];
}

export async function getProductById(id: number): Promise<Product | null> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Product WHERE id = ?',
    args: [id]
  });
  return rows.length > 0 ? (rows[0] as unknown as Product) : null;
}

export async function getProductsWithDetails(): Promise<Product[]> {
  const { rows: products } = await turso.execute(`
    SELECT p.*, c.name as categoryName, c.id as categoryId, c.slug as categorySlug
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    ORDER BY p.createdAt DESC
  `);
  
  const productsWithImages = [];
  
  for (const product of products) {
    const { rows: images } = await turso.execute({
      sql: 'SELECT * FROM ProductImage WHERE productId = ? ORDER BY order_num',
      args: [product.id]
    });
    
    productsWithImages.push({
      ...product,
      images: images as unknown as ProductImage[],
      category: product.categoryId ? {
        id: product.categoryId,
        name: product.categoryName,
        slug: product.categorySlug
      } : null
    });
  }
  
  return productsWithImages as unknown as Product[];
}

export async function getProductsWithDetailsLimited(limit?: number, sort?: string): Promise<Product[]> {
  let query = `
    SELECT p.*, c.name as categoryName, c.id as categoryId, c.slug as categorySlug
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
  `;
  
  // Add sorting
  if (sort === 'latest') {
    query += ' ORDER BY p.createdAt DESC';
  } else {
    query += ' ORDER BY p.createdAt DESC';
  }
  
  // Add limit
  if (limit && limit > 0) {
    query += ` LIMIT ${limit}`;
  }
  
  const { rows: products } = await turso.execute(query);
  
  const productsWithImages = [];
  
  for (const product of products) {
    const { rows: images } = await turso.execute({
      sql: 'SELECT * FROM ProductImage WHERE productId = ? ORDER BY order_num',
      args: [product.id]
    });
    
    productsWithImages.push({
      ...product,
      images: images as unknown as ProductImage[],
      category: product.categoryId ? {
        id: product.categoryId,
        name: product.categoryName,
        slug: product.categorySlug
      } : null
    });
  }
  
  return productsWithImages as unknown as Product[];
}

export async function getProductsWithCount({
  page = 1,
  limit = 12,
  categorySlug,
  minPrice,
  maxPrice,
  sort = 'latest'
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  const offset = (page - 1) * limit;

  let whereClauses = 'WHERE p.isPublished = TRUE';
  const queryParams: any[] = [];

  if (categorySlug && categorySlug !== 'all') {
    whereClauses += ' AND c.slug = ?';
    queryParams.push(categorySlug);
  }

  if (minPrice !== undefined) {
    whereClauses += ' AND p.price >= ?';
    queryParams.push(minPrice);
  }

  if (maxPrice !== undefined) {
    whereClauses += ' AND p.price <= ?';
    queryParams.push(maxPrice);
  }

  // First, get the total count of products with filters
  const countQuery = `
    SELECT COUNT(p.id) as total
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    ${whereClauses}
  `;
  
  const { rows: countRows } = await turso.execute({
    sql: countQuery,
    args: queryParams
  });
  const total = countRows[0].total as number;

  // Then, get the paginated products
  let productsQuery = `
    SELECT p.*, c.name as categoryName, c.id as categoryId, c.slug as categorySlug
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    ${whereClauses}
  `;
  
  if (sort === 'latest') {
    productsQuery += ' ORDER BY p.createdAt DESC';
  } else if (sort === 'price-asc') {
    productsQuery += ' ORDER BY p.price ASC';
  } else if (sort === 'price-desc') {
    productsQuery += ' ORDER BY p.price DESC';
  } else {
    productsQuery += ' ORDER BY p.createdAt DESC'; // Default sort
  }

  productsQuery += ' LIMIT ? OFFSET ?';
  queryParams.push(limit, offset);

  const { rows: products } = await turso.execute({
    sql: productsQuery,
    args: queryParams
  });

  const productsWithImages = [];
  for (const product of products) {
    const { rows: images } = await turso.execute({
      sql: 'SELECT * FROM ProductImage WHERE productId = ? ORDER BY order_num',
      args: [product.id]
    });
    
    productsWithImages.push({
      ...product,
      images: images as unknown as ProductImage[],
      category: product.categoryId ? {
        id: product.categoryId,
        name: product.categoryName,
        slug: product.categorySlug
      } : null
    });
  }

  return {
    products: productsWithImages as unknown as Product[],
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export interface ProductCreateData {
  name: string;
  description?: string;
  price: number;
  priceIsFrom?: boolean;
  categoryId: number;
  images: string[];
  status?: string;
  quantity?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  sku?: string;
  weight?: number;
  dimensions?: string;
  manufacturer?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export async function createProduct(data: ProductCreateData): Promise<Product> {
  // Generate a random slug
  const slug = `${nanoid(10)}`;
  
  // Insert the product
  const { rows } = await turso.execute({
    sql: `INSERT INTO Product (
      name, slug, description, price, priceIsFrom, imageUrl, categoryId,
      createdAt, updatedAt, status, quantity, isPublished,
      isFeatured, isNew, sku, weight, dimensions, manufacturer,
      metaTitle, metaDescription
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, 
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?
    ) RETURNING *`,
    args: [
      data.name,
      slug,
      data.description || null,
      data.price,
      data.priceIsFrom !== undefined ? data.priceIsFrom : false,
      data.images[0] || '',
      data.categoryId,
      data.status || 'IN_STOCK',
      data.quantity || null,
      data.isPublished !== undefined ? data.isPublished : true,
      data.isFeatured !== undefined ? data.isFeatured : false,
      data.isNew !== undefined ? data.isNew : true,
      data.sku || null,
      data.weight || null,
      data.dimensions || null,
      data.manufacturer || null,
      data.metaTitle || null,
      data.metaDescription || null,
    ]
  });
  
  const product = rows[0] as unknown as Product;
  
  // Insert product images
  if (data.images && data.images.length > 0) {
    for (let i = 0; i < data.images.length; i++) {
      await turso.execute({
        sql: `INSERT INTO ProductImage (url, productId, order_num, createdAt)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [data.images[i], product.id, i]
      });
    }
  }
  
  return product;
}

export interface ProductUpdateData extends Omit<Partial<Product>, 'images'> {
  images?: string[];
}

export async function updateProduct(id: number, data: ProductUpdateData): Promise<Product | null> {
  const { images, category, ...productDataWithComplexTypes } = data;
  
  // Filter out non-primitive values that can't be used as SQL parameters
  const productData: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(productDataWithComplexTypes)) {
    if (value === null || typeof value !== 'object') {
      productData[key] = value;
    }
  }
  
  const fields = Object.keys(productData)
    .map(key => `${key} = ?`)
    .join(', ');
  
  const values = Object.values(productData);
  
  if (fields.length > 0) {
    const { rows } = await turso.execute({
      sql: `UPDATE Product SET ${fields}, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ? RETURNING *`,
      args: [...values, id]
    });
    
    if (rows.length === 0) {
      return null;
    }
  }
  
  // Handle images if provided
  if (images) {
    // Delete existing images
    await turso.execute({
      sql: 'DELETE FROM ProductImage WHERE productId = ?',
      args: [id]
    });
    
    // Insert new images
    for (let i = 0; i < images.length; i++) {
      await turso.execute({
        sql: `INSERT INTO ProductImage (url, productId, order_num, createdAt)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [images[i], id, i]
      });
    }
    
    // Update main image URL
    if (images.length > 0) {
      await turso.execute({
        sql: 'UPDATE Product SET imageUrl = ? WHERE id = ?',
        args: [images[0], id]
      });
    }
  }
  
  // Get updated product
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Product WHERE id = ?',
    args: [id]
  });
  return rows.length > 0 ? (rows[0] as unknown as Product) : null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  // Delete product images first (due to foreign key constraint)
  await turso.execute({
    sql: 'DELETE FROM ProductImage WHERE productId = ?',
    args: [id]
  });
  
  // Delete the product
  const { rowsAffected } = await turso.execute({
    sql: 'DELETE FROM Product WHERE id = ?',
    args: [id]
  });
  return rowsAffected > 0;
}

// Admin operations
export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const { rows } = await turso.execute({
    sql: 'SELECT * FROM Admin WHERE email = ?',
    args: [email]
  });
  return rows.length > 0 ? (rows[0] as unknown as Admin) : null;
}

// CompanyInfo operations
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const { rows } = await turso.execute('SELECT * FROM CompanyInfo LIMIT 1');
  return rows.length > 0 ? (rows[0] as unknown as CompanyInfo) : null;
}

export async function updateCompanyInfo(data: Partial<CompanyInfo>): Promise<void> {
  const existing = await getCompanyInfo();
  if (existing) {
    const fields = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(data);
    await turso.execute({
      sql: `UPDATE CompanyInfo SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [...values, existing.id]
    });
  } else {
    const fields = Object.keys(data).join(', ');
    const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
    await turso.execute({
      sql: `INSERT INTO CompanyInfo (${fields}) VALUES (${placeholders})`,
      args: Object.values(data)
    });
  }
} 