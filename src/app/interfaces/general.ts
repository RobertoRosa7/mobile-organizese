/* eslint-disable @typescript-eslint/naming-convention */
export interface Register {
  category?: string;
  created_at: number;
  updated_at?: number;
  value: number;
  type: string;
  status: string;
  description?: string;
  operation?: string;
  brand?: string;
  edit?: boolean;
  user?: User;
  _id?: any;
  month?: number;
  cat_icon?: string;
  lista?: Register[];
  date?: Date;
}

export interface User {
  name?: string;
  email: string;
  created_at?: number;
  updated_at?: number;
  edit?: boolean;
  registers?: Register[];
  photo_url?: string;
  credit_card?: CreditCard;
  cpf?: string;
  phone?: string;
  token?: string;
}

export interface Login {
  password: string;
  email: string;
  phone_number?: number;
}

export interface Signup {
  password: string;
  email: string;
  created_at: number;
  verified: boolean;
}
export interface CreditCard {
  brand: string;
}

export interface Consolidado {
  total_credit: number;
  total_debit: number;
  total_consolidado: number;
}

export interface StatusCode {
  status: number;
  text: string;
}

export interface DialogData {
  type: string;
  data: any;
}
export interface Download {
  content: Blob | null;
  progress: number;
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}
export interface Chip {
  label: string;
  value: string | number;
  selected: boolean;
}
export interface RegisterByDay {
  day: number;
  list: Register[];
  total_credits: number;
  total_debits: number;
}
