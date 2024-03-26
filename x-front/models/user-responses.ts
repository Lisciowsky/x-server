import { UserInfo } from "./user"
 
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

// export interface LoginUserResponse {
//     session_id: string
//     access_token: string
//     access_token_expires_at: string
//     refresh_token: string
//     refresh_token_expires_at: string
//     user: CreateUserResponse
// }

export interface LoginUserResponse {
    status: string
}

export interface CreateUserResponse {
    username: string
    fullname: string
    email: string
    role: string
}

export interface UpdateUserRequest {
    current_password?: string;
    password?: string;
    fullname?: string;
    email?: string;
}

export interface GetUserResponse {
    username: string
    fullname: string
    email: string
    role: string
}

export interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
    user: UserInfo
  }
