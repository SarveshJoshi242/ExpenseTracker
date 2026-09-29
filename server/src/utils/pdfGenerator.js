import PDFDocument from 'pdfkit';

export const generateExpensePDF = (expenses, stats) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.fontSize(20).text('Expense Report', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(14).text(`Total Income: ${stats.totalIncome || 0}`);
      doc.text(`Total Expense: ${stats.totalExpense || 0}`);
      doc.text(`Balance: ${stats.balance || 0}`);
      doc.moveDown();
      
      doc.fontSize(16).text('Transactions:', { underline: true });
      doc.moveDown();
      
      expenses.forEach((exp, i) => {
        const d = new Date(exp.date).toLocaleDateString();
        doc.fontSize(12).text(`${i + 1}. ${d} | ${exp.title} | ${exp.type.toUpperCase()} | Amount: ${exp.amount} | Cat: ${exp.categoryId?.name || 'N/A'}`);
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
