import { User } from "./user"

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

export interface SearchUserResponse {
    username: string
    fullname: string
    email: string
    role: string
}
