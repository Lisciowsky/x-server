export interface UserInfo {
    username: string;
    fullname: string;
    email: string;
    role: string;
  }
  
export interface User {
  username: string;
  full_name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  password_changed_at: string; // Assuming ISO 8601 format, adjust if necessary
  created_at: string; // Assuming ISO 8601 format, adjust if necessary
}

export interface PaginatedUsersResponse {
  page: number;
  page_size: number
  total_users: number;
  users: User[];
}

export interface UpdateUserResponse {
    success: boolean
    username: string
    role: string
}

export interface CreateUserResponse {
  username: string
  fullname: string
  email: string
  role: string
}
