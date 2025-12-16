export interface User {
  id?: number;
  email?: string;
  passwordHash?: string;
  username?: string;
  fullName?: string;
  role?: 'superadmin' | 'client-admin' | 'client-user';
  clientId?: number | null;
  emailPreferences?: boolean;
  country?: {
    code: string;
    name: string;
  };
  emailVerified?: boolean;
  loginProvider?: 'local' | 'google' | 'wallet';
  metamaskAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  sessionId?:string
  _2faAuthentication?:boolean;
  deletetionScheduleAt: Date;
  phone:string;
  status: 'active' | 'pending_deletion' | 'deleted'
}
