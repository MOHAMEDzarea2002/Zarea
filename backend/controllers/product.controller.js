const Product = require('../models/product.model')
const mongoose = require("mongoose");
const { uploadCloudinary } = require('../services/upload.service')

const createProduct = async (req, res) => {
  try {
    // image
    const { mainImage, gallery } = req.files
    const variants = req.body.variants

    // submit mainImage buffer
    if (!mainImage || mainImage.length === 0) {
      return res.status(400).json({
        message: "mainImage are required"
      })
    }
    const mainImageUploadUrl = await uploadCloudinary(mainImage[0].buffer)

    // submit galleryUploads buffer
    const galleryUploads = (gallery || []).map((gallery) => {
      return uploadCloudinary(gallery.buffer)
    })

    // promise all gallery
    let galleryUrl = await Promise.all(galleryUploads)

    // url all images
    const images = [mainImageUrl, ...galleryUrl]



    const variantsSet = new Set()

    let variantsJson = JSON.parse(variants)

    // check on variants
    if (!Array.isArray(variantsJson)) {
      return res.status(400).json({
        Message: "Variants must be an array"
      })
    }

    // loop on variants
    variantsJson?.forEach((variant) => {
      const key = `${variant.color}-${variant.size}`;
      variantsSet.add(key)
    })

    // Check the value variants for duplicates.
    if (variantsJson.length > variantsSet.size) {
      return res.status(400).json({ message: "Duplicate color and size combinations are not allowed." })
    }

    const ProductData = { ...req.body, images: images, variants: variantsJson }
    // create product
    const newProduct = await Product.create(ProductData)

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, message: err.message })
  }
}


const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "newest",
      category,
      minPrice,
      maxPrice,
      search,
      status,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const filter = {};

    // الزباين يشوف المنتجات الفعالة بس، والأدمن يقدر يطلب الكل بـ ?status=all
    if (status !== "all") filter.status = "active";

    // نتجاهل الـ category لو مش ObjectId صالح بدل ما Mongoose يرمي CastError
    if (category && mongoose.isValidObjectId(category)) {
      filter.category = category;
    }

    // السعر: نتأكد إنه رقم فعلاً
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice !== undefined && minPrice !== "" && !Number.isNaN(min)) {
      filter.price = { ...filter.price, $gte: min };
    }
    if (maxPrice !== undefined && maxPrice !== "" && !Number.isNaN(max)) {
      filter.price = { ...filter.price, $lte: max };
    }

    // البحث: نهرب الحروف الخاصة في الـ regex عشان ميعملش خطأ أو injection
    if (typeof search === "string" && search.trim()) {
      const safe = search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [{ name: rx }, { description: rx }];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name image")
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      message: "Products fetched successfully",
      data: products,
      pagination: {
        limit: limitNum,
        page: pageNum,
        total,
        totalPage: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(200).json({
      success: true,
      data: product
    })
  } catch (err) {
    res.status(500).json({ message: "Internal server error" })
  }
}
const updateProduct = async (req, res) => {
  try {
    const idProduct = req.params.id
    const variants = req.body.variants
    const { mainImage, gallery } = req.files
    const updateProduct = { ...req.body }

    // check product found
    const existsProduct = await Product.findById({ _id: req.params.id })

    if (!existsProduct) {
      return res.status(404).json({
        message: "Not Found Product"
      })
    }

    // kep existing images
    let imagesUrl = [...(existsProduct.images) || []]
    // upload mainImage
    if (mainImage?.length > 0) {
      const mainImageUpload = await uploadCloudinary(mainImage[0].buffer)
      imagesUrl[0] = mainImageUpload
    }

    if (gallery?.length > 0) {
      const galleryUpload = (gallery || []).map((imag) => {
        return uploadCloudinary(imag.buffer)
      })
      const galleryUrls = await Promise.all(galleryUpload)
      imagesUrl = [imagesUrl[0], ...galleryUrls]
    }


    const variantsSet = new Set()

    // Converting  variants to JSON
    const variantsJson = JSON.parse(variants)

    // Check Is 'variant' not an array
    if (!Array.isArray(variantsJson)) {
      res.status(400).json({
        message: "variants must be an array"
      })
    }

    // Loop on variants and add Set
    variantsJson.forEach((variant) => {
      const key = `${variant.size}-${variant.color}`
      return variantsSet.add(key)
    })
    // check Duplicate variants
    if (variantsJson.length > variantsSet.size) {
      return res.status(400).json({
        message: "Duplicate color and size combinations are not allowed."
      })
    }

    const productData = { ...updateProduct, variants: variantsJson, images: imagesUrl }
    // updataProduct and save data
    const product = await Product.findByIdAndUpdate(idProduct, productData, {
      returnDocument: 'after',
      runValidators: true
    })


    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError" || error.name === "CastError")
      return res.status(400).json({ message: error.message });
    if (error.code === 11000)
      return res.status(409).json({ message: "Duplicate value" });
    res.status(500).json({ message: "Internal server error" });
  }
}


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ message: 'internal server error' })
  }
}
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
}



