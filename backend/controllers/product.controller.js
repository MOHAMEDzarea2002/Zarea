const Product = require('../models/product.model')
const mongoose = require("mongoose");
const { uploadCloudinary } = require('../services/upload.service')

const createProduct = async (req, res) => {
  try {
    const { mainImage, gallery } = req.files || {};

    if (!mainImage || mainImage.length === 0) {
      return res.status(400).json({ message: "mainImage is required" });
    }

    // نفحص الـ variants قبل ما نرفع أي صورة
    let variantsJson;
    try {
      variantsJson = JSON.parse(req.body.variants);
    } catch {
      return res.status(400).json({ message: "Variants must be valid JSON" });
    }

    if (!Array.isArray(variantsJson) || variantsJson.length === 0) {
      return res.status(400).json({ message: "Variants must be a non-empty array" });
    }

    const keys = new Set(variantsJson.map((v) => `${v.color}-${v.size}`));
    if (keys.size !== variantsJson.length) {
      return res.status(400).json({
        message: "Duplicate color and size combinations are not allowed.",
      });
    }

    // رفع الصور
    const mainImageUrl = await uploadCloudinary(mainImage[0].buffer);
    const galleryUrls = await Promise.all(
      (gallery || []).map((img) => uploadCloudinary(img.buffer)),
    );

    const newProduct = await Product.create({
      ...req.body,
      variants: variantsJson,
      images: [mainImageUrl, ...galleryUrls],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product data" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { mainImage, gallery } = req.files || {};
    const updateData = { ...req.body };

    // الصور بتتغير من الملفات بس، مش من الـ body
    delete updateData.images;
    delete updateData.variants;

    // الصور: نبدأ بالقديمة ونغيّر اللي اتبعت بس
    let images = [...(product.images || [])];

    if (mainImage?.length > 0) {
      images[0] = await uploadCloudinary(mainImage[0].buffer);
    }

    if (gallery?.length > 0) {
      const galleryUrls = await Promise.all(
        gallery.map((img) => uploadCloudinary(img.buffer)),
      );
      images = [images[0], ...galleryUrls];
    }

    updateData.images = images;

    // الـ variants اختيارية في التعديل
    if (req.body.variants !== undefined) {
      let variantsJson;
      try {
        variantsJson = JSON.parse(req.body.variants);
      } catch {
        return res.status(400).json({ message: "Variants must be valid JSON" });
      }

      if (!Array.isArray(variantsJson) || variantsJson.length === 0) {
        return res.status(400).json({ message: "Variants must be a non-empty array" });
      }

      const keys = new Set(variantsJson.map((v) => `${v.color}-${v.size}`));
      if (keys.size !== variantsJson.length) {
        return res.status(400).json({
          message: "Duplicate color and size combinations are not allowed.",
        });
      }

      updateData.variants = variantsJson;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product data" });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate value" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


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



