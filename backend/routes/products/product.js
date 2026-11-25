const express = require("express");
const router = express.Router()

// controller
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../../controllers/product.controller')
const { uploadImage } = require('../../middleware/upload')
// middleware
const { verifyToken } = require('../../middleware/auth.middleware')
const { verifyAdmin } = require('../../middleware/admin.middleware')

// Routes
router.post("/", verifyToken, verifyAdmin, uploadImage, createProduct)
router.get("/", getAllProducts)
router.get("/:id",  getProductById)
router.patch("/:id", verifyToken, verifyAdmin, uploadImage, updateProduct)
router.delete("/:id",verifyToken, verifyAdmin,  deleteProduct)
module.exports = router
