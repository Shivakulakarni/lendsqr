export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: 'active' | 'inactive' | 'pending' | 'blacklisted';
  orgName: string;
  orgEmail: string;
  level: number;
  numOfLoans: number;
  loanAmount: number;
  savingsAmount: number;
  guarantorName: string;
  guarantorEmail: string;
  guarantorPhoneNumber: string;
  nameOfNextOfKin: string;
  nextOfKinEmail: string;
  nextOfKinPhoneNumber: string;
  nextOfKinRelationship: string;
  ssn: string;
  bvn: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
  accountBalance: number;
  adminNotes?: string;
}

export interface PaginatedResponse {
  data: User[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  token: string | null;
}

export interface FilterOptions {
  search: string;
  status?: 'active' | 'inactive' | 'pending' | 'blacklisted';
  page: number;
  perPage: number;
}

export interface ApiError {
  message: string;
  status: number;
}
