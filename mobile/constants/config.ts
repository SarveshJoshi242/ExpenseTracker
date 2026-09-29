export const CONFIG = {
  API_URL: 'http://localhost:5000/api',
  APP_NAME: 'ExpenseTracker Pro',
  CURRENCY_SYMBOLS: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  } as Record<string, string>,
  PAYMENT_METHODS: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Wallet']
};
