const category = require("../models/category.model");
const Product = require("../models/product.model");
// Controller functions for category operations
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categories = await category.findById(req.params.id);
    if(!categories) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'internal server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const categories = await category.create(req.body);
    res.status(201).json({
      success: true,
      data: categories
    });
  } catch (error) {
    if(error.name === "ValidationError") {
     return res.status(400).json({ message:  error.message });
    }
    res.status(500).json({ message:  'Internal Server Error' });
  };
}
exports.updateCategory = async (req, res) => {
  try {
    const categories = await category.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' ,runValidators: true});
    if (!categories){
      return res.status(404).json({
        message: "Category not found"
      })
    }
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const hasProducts = await Product.exists({ category: req.params.id });
    if (hasProducts) {
      return res.status(409).json({
        message: "This category has products. Move or delete them first.",
      });
    }

    const deleted = await category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
