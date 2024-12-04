import { SearchSortOrder, UserRole } from "./enums";

export interface AuthRequestDTO{
    email: string;
    password: string;
}

export interface AuthResponseDTO{
    jwt: string;
    err: string;
}

export interface RegisterDTO{
    name: string;
    password: string;
    role: UserRole;
    email: string;
    phoneNumber: number;
    address: string;
}

export interface CartItemDTO{ 
    userId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    dateAdded: Date;
}

export interface ProductDTO{
    productName: string;
    vendorId: number;
    productId: number;
    vendorName: string;
    price: number;
    description: string;
    categoryId: number;
}

export interface SearchCriteriaDTO{
    searchTerm: string;
    vendor?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    priceOrder?: SearchSortOrder;
    pageNumber?: number;
    perPage?: number;
    creationOrder?: SearchSortOrder;
}
