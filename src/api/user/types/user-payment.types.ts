import { UserStatus } from '../user.role';

export interface RawUserPaymentData {
    user_id: string;
    user_firstName: string | null;
    user_lastName: string | null;
    user_email: string;
    user_companyName: string | null;
    user_status: UserStatus;
    user_createdDate: Date;
    payment_id: string | null;
    payment_amount: number | null;
    payment_status: string | null;
    payment_createdDate: Date | null;
}

export interface PaymentData {
    id: string;
    amount: number;
    status: string;
    createdDate: Date;
}

export interface UserWithPayment {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    companyName: string | null;
    status: UserStatus;
    createdDate: Date;
    payment: PaymentData | null;
}

export interface PaginatedUserPaymentResponse {
    data: UserWithPayment[];
    count: number;
    totalPages: number;
    hasMore: boolean;
    size: number;
}
