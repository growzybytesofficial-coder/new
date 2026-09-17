import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    productSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductImage = mongoose.model('ProductImage', productImageSchema);
export default ProductImage;
