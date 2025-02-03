export enum AppEnvEnum {
	local = 'local',
	dev = 'dev',
	prod = 'prod',
	staging = 'staging'
}

export enum ApiKeyStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive'
}

export enum PaymentState {
	INITIALIZED = 'initialized',    // User clicked subscribe
	TOKENIZED = 'tokenized',       // Card details entered, awaiting 3DS/OTP
	COMPLETED = 'completed',       // Payment fully completed
	FAILED = 'failed'             // Payment failed at any step
}

export enum PaymentAction {
	TOKENIZATION = 'tokenization',
	TRANSACTION = 'transaction',
	AUTHORIZATION = 'authorization',
	AUTHENTICATION = 'authentication',
	VOID_AUTHORIZATION = 'voidAuthorization'
}

export enum PaymentStatus {
	PENDING = 'pending',           // Payment is in process
	SUCCESS = 'success',           // Payment completed successfully
	FAILED = 'failed',            // Payment failed
	REQUIRES_ACTION = 'requires_action'  // Requires user action (3DS/OTP)
}

export enum PackageType {
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}

export enum SubscriptionStatus {
	NotRequired = 'NotRequired',
	Active = 'Active',
	Suspended = 'Suspended',
	Inactive = 'Inactive',
	PendingPayment = 'PendingPayment',
	RequestedCancellation = 'RequestedCancellation',
	Cancelled = 'Cancelled'
}

export enum TransactionResponseCodeStatus {
  AuthorizationSuccess = '02',
  AuthorizationFailed = '03',
  AuthorizationVoidedSuccessfully = '08',
  AuthorizationVoidFailed = '09',
  Incomplete = '10',
  PurchaseFailure = '13',
  PurchaseSuccess = '14',
  OnHold = '20'
}

export enum ActivityLogType {
  USER_SIGNUP = 'user_signup',
  PAYMENT_COMPLETED = 'payment_completed',
  API_KEY_CREATED = 'api_key_created'
}