export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  LEGAL_ENTITY = 'LEGAL_ENTITY',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface User {
  username: string;
  password: string;
}

export interface CreateUserAdmin {
  email: string;
  password: string;
}

export interface CreateUserLegalEntity {
  email: string;
  password: string;
  address: string;
}

export interface CreateUserIndividual {
  email: string;
  password: string;
  address: string;
}

export interface UserProfile {
  id: number;
  email: string;
  user_role: string;
  address: string;
  created_at: Date;
}
