import { UserRole } from "./enums";

export interface AuthRequest{
    email: string;
    password: string;
}

export interface AuthResponse{
    jwt: string;
    err: string;
}

export interface RegisterRequest{
    name: string;
    password: string;
    role: UserRole;
    email: string;
    phoneNumber: Number;
    address: string;
}

export interface CartType{
    userId: Number;
    productId: Number;
    quantity: Number;
    dateAdded: Date;
}