import { api } from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories');
    return data;
  },
  
  createCategory: async (category: Partial<Category>): Promise<ApiResponse<Category>> => {
    const { data } = await api.post('/categories', category);
    return data;
  },
  
  updateCategory: async (id: string, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },
  
  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  }
};
