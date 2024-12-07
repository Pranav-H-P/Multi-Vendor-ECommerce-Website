import { Rating, SearchSortOrder, UserRole, VendorApprovalStatus } from "./enums";

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
    product: ProductDTO;
    quantity: number;
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
    averageRating: number;
    sales: number;
    stock: number;
    categoryName:string;
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
    ratingOrder?: SearchSortOrder;
    salesOrder?: SearchSortOrder;
    stockOrder?: SearchSortOrder;
}

export interface ReviewDTO{
    id: number;
    productId: number;
    userId: number;
    userName: string;
    rating: Rating;
    comment: string;
    reviewDate: Date;
}

export interface ReviewCriteriaDTO{ // for retrieving reviews
    productId: number;
    pageNumber: number;
    perPage: number;
    timeOrder?: SearchSortOrder;
    ratingOrder?: SearchSortOrder;
}

export interface Vendor{
    id: number;
    name: string;
    contactDetails: string;
    description: string;
    approvalStatus: VendorApprovalStatus;
    joinDate: Date;
}

export interface Category{
    id: number;
    name: string;
    description: string;
    parentId: number;
}

export interface UserProfile{
    id: number;
    name: string;
    role?: UserRole;
    email: string;
    phoneNumber: number;
    address: string;
    isActive?: boolean;
    passwordHash?: string; // gets removed before sending

}