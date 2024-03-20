export interface UserInfo {
    username: string;
    fullname: string | null;
    email: string | null;
    role: string | null;
  }
  
// Update to AllUsers interface to include new fields
export interface AllUsers {
  username: string;
  full_name: string;
  email: string | null;
  role: string;
  is_email_verified: boolean;
  password_changed_at: string; // Assuming ISO 8601 format, adjust if necessary
  created_at: string; // Assuming ISO 8601 format, adjust if necessary
}

// Define a new interface for the paginated response
export interface PaginatedUsersResponse {
  page: number;
  page_size: number
  total_users: number;
  users: AllUsers[];
}
