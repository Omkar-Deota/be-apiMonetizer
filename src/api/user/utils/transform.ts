import { RawUserPaymentData, UserWithPayment } from '../types/user-payment.types';

export const transformRawData = (raw: RawUserPaymentData): UserWithPayment => ({
    id: raw.user_id,
    firstName: raw.user_firstName,
    lastName: raw.user_lastName,
    email: raw.user_email,
    companyName: raw.user_companyName,
    status: raw.user_status,
    createdDate: raw.user_createdDate,
    payment: raw.payment_id ? {
        id: raw.payment_id,
        amount: raw.payment_amount!,
        status: raw.payment_status!,
        createdDate: raw.payment_createdDate!
    } : null
});
