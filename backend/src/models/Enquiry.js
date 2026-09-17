import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    enquiryId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry',
    },
    inquiryType: {
      type: String,
      default: 'Product Inquiry',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    needCallback: {
      type: Boolean,
      default: false,
    },
    bulkPricing: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Contacted', 'Resolved', 'Closed'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
