import { parse } from 'json2csv';
import { generateExpensePDF } from '../utils/pdfGenerator.js';

export const exportToCSV = (expenses) => {
  const fields = ['date', 'title', 'amount', 'type', 'category', 'paymentMethod', 'note'];
  
  const data = expenses.map(exp => ({
    date: exp.date.toISOString().split('T')[0],
    title: exp.title,
    amount: exp.amount,
    type: exp.type,
    category: exp.categoryId?.name || 'N/A',
    paymentMethod: exp.paymentMethod,
    note: exp.note || ''
  }));

  return parse(data, { fields });
};

export const exportToPDF = async (expenses, stats) => {
  return await generateExpensePDF(expenses, stats);
};
