export const USER_FIELDS = [
    'user.id as "user_id"',
    'user.firstName as "user_firstName"',
    'user.lastName as "user_lastName"',
    'user.email as "user_email"',
    'user.companyName as "user_companyName"',
    'user.status as "user_status"',
    'user.createdDate as "user_createdDate"'
] as const;

export const PAYMENT_FIELDS = [
    'payment.id as "payment_id"',
    'payment.amount as "payment_amount"',
    'payment.status as "payment_status"',
    'payment.createdDate as "payment_createdDate"'
] as const;
