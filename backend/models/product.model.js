const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: 1,
  },

  description: {
    type: String,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  images: [
    {type:String,
      
    }
  ],

  variants: [
    {
      color: {
        type: String,
        required: true,
      },

      size: {
        type: String,
        required: true,
      },

      stock: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
