const category = require("../models/category.model");

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
    const categories = await category.findByIdAndDelete(req.params.id);
    if (!categories) return res.status(404).json({ message: "Category not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
