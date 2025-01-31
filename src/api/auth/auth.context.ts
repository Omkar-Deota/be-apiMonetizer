import { UserRole } from '../../types/enums';

export interface RequestContext {
  email: string;
  userId: string;
  role: UserRole | undefined;
  authExternalId: string;
  emailVerified: boolean;
}
