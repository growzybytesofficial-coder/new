import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ProductImage from '../models/ProductImage.js';
import { products as initialProducts } from '../../../frontend/src/data/products.js';

const router = express.Router();

// Ensure uploads folder exists safely
const uploadsDir = path.resolve(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('Note: uploads directory creation:', err.message);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// Filter to only allow image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, jpeg, png, webp, gif, svg) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// Helper to get image mappings
const getImageMap = async () => {
  try {
    const mappings = await ProductImage.find({});
    const responseMap = {};
    mappings.forEach((mapping) => {
      responseMap[mapping.productSlug] = mapping.imageUrl;
    });
    return responseMap;
  } catch (err) {
    return {};
  }
};

// GET /api/products/images - Get all product-to-image mappings
router.get('/images', async (req, res) => {
  try {
    const responseMap = await getImageMap();
    res.status(200).json({
      success: true,
      images: responseMap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product images',
      error: error.message,
    });
  }
});

// GET /api/products/categories - Get unique list of product categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesSet = new Set();
    initialProducts.forEach((p) => {
      if (p.category) categoriesSet.add(p.category);
    });
    const categories = ['All', ...Array.from(categoriesSet).sort()];
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
});

// GET /api/products/featured - Get featured / popular products
router.get('/featured', async (req, res) => {
  try {
    const imageMap = await getImageMap();
    const featured = initialProducts
      .filter((p) => p.section === 'featured' || p.badge === 'Popular' || p.badge === 'Best Seller')
      .slice(0, 12)
      .map((p) => ({
        ...p,
        image: imageMap[p.slug] || p.image || null,
      }));

    res.status(200).json({
      success: true,
      count: featured.length,
      products: featured,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured products',
      error: error.message,
    });
  }
});

// POST /api/products/image - Upload/Insert a product image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const { productSlug, imageUrl } = req.body;

    if (!productSlug) {
      return res.status(400).json({
        success: false,
        message: 'Product slug is required',
      });
    }

    let finalImageUrl = imageUrl;

    // If a file was uploaded, construct its local URL path
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Either an uploaded image file or a valid imageUrl is required',
      });
    }

    // Upsert the image URL for the product slug
    const updatedMapping = await ProductImage.findOneAndUpdate(
      { productSlug },
      { imageUrl: finalImageUrl },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product image associated successfully',
      data: updatedMapping,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to associate product image',
      error: error.message,
    });
  }
});

// GET /api/products - Get all products with filtering, search, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, section, badge, limit = 50, page = 1 } = req.query;
    const imageMap = await getImageMap();

    let filtered = initialProducts;

    if (category && category.toLowerCase() !== 'all') {
      const targetCat = category.toLowerCase();
      filtered = filtered.filter((p) => p.category && p.category.toLowerCase() === targetCat);
    }

    if (section) {
      filtered = filtered.filter((p) => p.section === section);
    }

    if (badge) {
      filtered = filtered.filter((p) => p.badge && p.badge.toLowerCase() === badge.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginated = filtered.slice(startIndex, startIndex + parsedLimit).map((p) => ({
      ...p,
      image: imageMap[p.slug] || p.image || null,
    }));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      products: paginated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message,
    });
  }
});

// GET /api/products/:idOrSlug - Get single product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const imageMap = await getImageMap();

    const product = initialProducts.find(
      (p) =>
        String(p.id) === String(idOrSlug) ||
        p.slug === idOrSlug ||
        (p.sku && p.sku.toLowerCase() === idOrSlug.toLowerCase())
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product: {
        ...product,
        image: imageMap[product.slug] || product.image || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message,
    });
  }
});

export default router;
