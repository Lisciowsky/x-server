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
  password_changed_at: string;
  created_at: string;
}
