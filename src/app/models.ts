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
    phonenumber: number;
    address: string;
}

export interface CartType{ // for data retrieval from api
    userId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    dateAdded: Date;
}
