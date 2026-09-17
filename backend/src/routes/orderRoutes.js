import express from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrManager } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Custom bypass middleware for demo-token
const protectAdminRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer demo-token') {
    // Inject fake admin user for bypass
    req.user = {
      _id: '60c72b2f9b1d8b2e5c8b4567',
      name: 'Demo Admin',
      email: 'demo@itsaathi.in',
      role: 'admin',
    };
    return next();
  }
  
  // Standard protect + adminOrManager middleware flow
  return protect(req, res, () => {
    adminOrManager(req, res, next);
  });
};

// GET /api/orders/my-orders - Get current logged-in customer's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await Order.find({ customerEmail: email });
    // Sort orders by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your orders.',
      error: error.message,
    });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !items.length || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required checkout fields.',
      });
    }

    // Generate unique human-readable order ID: JIT-XXXXX
    const orderId = `JIT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await Order.create({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.',
      error: error.message,
    });
  }
});

// GET /api/orders - Get all orders (Admin only)
router.get('/', protectAdminRoute, async (req, res) => {
  try {
    const orders = await Order.find({});
    // Sort orders by newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders.',
      error: error.message,
    });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', protectAdminRoute, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
      error: error.message,
    });
  }
});

// DELETE /api/orders/:id - Cancel/Delete order (Admin only)
router.delete('/:id', protectAdminRoute, async (req, res) => {
  try {
    // Check if order exists
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // In a JSON-db offline setting or Mongoose, delete the order
    // Let's implement deleting support
    const mongoose = (await import('mongoose')).default;
    const dbPath = (await import('path')).default.resolve(process.cwd(), 'uploads', 'local_db.json');
    
    // Check if we are in local offline mode
    const fs = (await import('fs')).default;
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      data.orders = data.orders.filter(o => o._id !== req.params.id && o.orderId !== req.params.id);
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } else {
      await order.deleteOne();
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled and deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order.',
      error: error.message,
    });
  }
});

// POST /api/orders/invoice/email - Send tax invoice via email
router.post('/invoice/email', protectAdminRoute, async (req, res) => {
  try {
    const { to, customerName, invoiceNumber, totalAmount, items } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email address is required',
      });
    }

    const { sendEmail } = await import('../services/emailService.js');
    const itemsListHtml = Array.isArray(items)
      ? items.map(it => `<li>${it.name || it.description} - Qty: ${it.quantity || it.qty || 1} - ₹${it.total || it.price}</li>`).join('')
      : '';

    await sendEmail({
      to,
      subject: `IT SAATHI - Tax Invoice #${invoiceNumber || 'INV'}`,
      text: `Hello ${customerName || 'Customer'},\n\nPlease find details for Tax Invoice #${invoiceNumber || 'INV'}. Total Amount: ₹${totalAmount}.\n\nThank you for choosing IT SAATHI.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0066cc;">IT SAATHI - Tax Invoice</h2>
          <p>Hello <strong>${customerName || 'Customer'}</strong>,</p>
          <p>Your invoice <strong>#${invoiceNumber || 'INV'}</strong> has been processed.</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          ${itemsListHtml ? `<ul>${itemsListHtml}</ul>` : ''}
          <p>Thank you for partnering with IT SAATHI!</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: `Tax invoice emailed to ${to} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send invoice email',
      error: error.message,
    });
  }
});

export default router;
