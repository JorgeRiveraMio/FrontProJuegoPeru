export interface AuthResponse {
    username: string;
    message: string;
    rol: string[];
    jwt: string;
    success: boolean;
}