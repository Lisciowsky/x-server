import { Media } from "./media";

export interface PaginatedMediaResponse {
    page: number;
    page_size: number
    total_media: number;
    media: Media[];
}

export interface GetMediaAccessResponse {
    signed_url: string
}

export interface GetPresignedUploadResponse {
    url: string
}
export interface RegisterMediaResponse {
    media_id: number
    created_at: string
    size_in_mb: number
}

export interface GetUserMediaResponse {
    page: number;
    page_size: number
    total_media: number;
    media: Media[];
}
