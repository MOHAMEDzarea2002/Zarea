const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/auth.middleware");
const { verifyAdmin } = require("../../middleware/admin.middleware");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/category.controller");

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);


router.post("/", verifyToken, verifyAdmin, createCategory);
router.put("/:id", verifyToken, verifyAdmin, updateCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
