export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  groups: string[]; // Array of group IDs
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  GROUP_ADMIN = 'GROUP_ADMIN',
  USER = 'USER'
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}
