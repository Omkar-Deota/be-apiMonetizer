export const PAYMENT_CONFIG = {
  ACCESS_CODE: process.env.PAYMENT_ACCESS_CODE || '',
  MERCHANT_IDENTIFIER: process.env.MERCHANT_IDENTIFIER || '',
  SHA_REUEST_PHRASE: process.env.SHA_REUEST_PHRASE || '',
  PAYMENT_SUCCESS_URL: process.env.PAYMENT_SUCCESS_URL || '',
  PAYMENT_TOKENIZE_URL: process.env.PAYMENT_TOKENIZE_URL || '',
  PAYMENT_CURRENCY: process.env.PAYMENT_CURRENCY || 'AED',
  PAYMENT_LANGUAGE: 'en',
  MERCHAT_PAGE_URL: process.env.MERCHAT_PAGE_URL || '',
  FE_SUCCESS_URL: process.env.FE_SUCCESS_URL || '',
  FE_FAIL_URL: process.env.FE_FAIL_URL || '',
  PAY_URL: process.env.PAY_URL || ''
} as const;
