export interface AuthResponse {
    username: string;
    message: string;
    rol: string[];
    token: string;
    success: boolean;
}