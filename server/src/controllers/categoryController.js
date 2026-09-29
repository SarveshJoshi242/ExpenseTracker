import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      $or: [{ userId: req.user.id }, { isDefault: true, userId: null }]
    }).sort({ type: 1, name: 1 });
    
    successResponse(res, 200, 'Categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color, type } = req.body;
    
    const category = await Category.create({
      userId: req.user.id,
      name,
      icon,
      color,
      type
    });
    
    successResponse(res, 201, 'Category created', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let category = await Category.findOne({ _id: id, userId: req.user.id });
    if (!category) {
      return errorResponse(res, 404, 'Category not found or you do not have permission');
    }

    category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    successResponse(res, 200, 'Category updated', category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!category) {
      return errorResponse(res, 404, 'Category not found or you do not have permission');
    }
    
    successResponse(res, 200, 'Category deleted');
  } catch (error) {
    next(error);
  }
};
