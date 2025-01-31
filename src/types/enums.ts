export enum AppEnvEnum {
  local = 'local',
  dev = 'dev',
  prod = 'prod',
  staging = 'staging',
}

export enum ApiKeyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ONBOARDING = 'ONBOARDING',
  LOGGED_IN = 'LOGGED_IN',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ADMIN_APPROVED = 'ADMIN_APPROVED',
  ADMIN_REJECTED = 'ADMIN_REJECTED',
  PENDING_PAYMENT_APPROVAL = 'PENDING_PAYMENT_APPROVAL',
}
