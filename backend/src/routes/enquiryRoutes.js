import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrManager } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Custom bypass middleware for demo-token or admin protection
const protectAdminRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer demo-token') {
    req.user = {
      _id: '60c72b2f9b1d8b2e5c8b4567',
      name: 'Demo Admin',
      email: 'admin@itsaathi.in',
      role: 'admin',
    };
    return next();
  }
  
  return protect(req, res, () => {
    adminOrManager(req, res, next);
  });
};

// POST /api/enquiries - Public endpoint to submit an inquiry from Contact page
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, city, subject, inquiryType, message, needCallback, bulkPricing } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone number, and message.',
      });
    }

    const enquiryId = `ENQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newEnquiry = await Enquiry.create({
      enquiryId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city ? city.trim() : '',
      subject: subject ? subject.trim() : `${inquiryType || 'General'} for IT SAATHI`,
      inquiryType: inquiryType || 'Product Inquiry',
      message: message.trim(),
      needCallback: !!needCallback,
      bulkPricing: !!bulkPricing,
      status: 'New',
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! The IT SAATHI team will contact you shortly.',
      enquiry: newEnquiry,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again or reach out to us at 8006033345.',
      error: error.message,
    });
  }
});

// GET /api/enquiries - Admin list of all customer enquiries
router.get('/', protectAdminRoute, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({});
    // Sort by newest first
    enquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries.',
      error: error.message,
    });
  }
});

// PUT /api/enquiries/:id/status - Admin update enquiry status
router.put('/:id/status', protectAdminRoute, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['New', 'In Progress', 'Contacted', 'Resolved', 'Closed'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry status updated successfully.',
      enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status.',
      error: error.message,
    });
  }
});

// DELETE /api/enquiries/:id - Admin delete enquiry
router.delete('/:id', protectAdminRoute, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      });
    }

    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    const dbPath = path.resolve(process.cwd(), 'uploads', 'local_db.json');
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (data.enquiries) {
        data.enquiries = data.enquiries.filter(e => e._id !== req.params.id && e.enquiryId !== req.params.id);
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
      }
    } else {
      await enquiry.deleteOne();
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete enquiry.',
      error: error.message,
    });
  }
});

export default router;
