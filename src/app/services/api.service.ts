import { inject, Injectable, signal } from '@angular/core';
import { Category, ProductDTO, ReviewCriteriaDTO, ReviewDTO, SearchCriteriaDTO, Vendor } from '../models';
import { LocalStorageService } from './local-storage.service';
import { UserDataService } from './user-data.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SearchSortOrder } from '../enums';

@Injectable({
  providedIn: 'root'
})

/*
Contains methods to access all API endpoints that are not authenticated
*/


export class ApiService {


  backendURL:string = "http://localhost:8080/api/"

  http = inject(HttpClient)
  localStorageService = inject(LocalStorageService)
  userDataService = inject(UserDataService)


  constructor() { }

  // image related methods
  getProductImageList(id: number){
    return this.http.get<string[]>(this.backendURL + 'images/product/' + id.toString())
      .pipe(
        catchError((error) => {
          console.log("Images not found", error);
          return of(null);
        })
    );
  }

  // product related methods

  searchProducts(criteria: SearchCriteriaDTO){ // proper search with criteria

    return this.http.post<ProductDTO[]>(this.backendURL + 'product/search', criteria)
    .pipe(
      catchError((error) => {
        console.log("Products not found", error);
        return of(null);
      })
    );
  }

  getSearchPreview(itemName: string){ // for homebar search

    let criteria: SearchCriteriaDTO = {
      searchTerm: itemName,
      perPage: 6
    };
    return this.searchProducts(criteria);
  }

  getProductData(id: number): Observable<ProductDTO | null> { // get one ProductDTO by id directly
    return this.http.get<ProductDTO>(this.backendURL + 'product/' + id.toString())
    .pipe(
      catchError((error) => {
        console.log("Product not found", error);
        return of(null);
      })
    );
  }

  getSimilar(product: ProductDTO | null, perPage: number, pgNo: number) { // load other items in category

    if (product === null || product === undefined){
      return;
    }

    let criteria: SearchCriteriaDTO = {
      searchTerm: "",
      perPage: perPage,
      pageNumber: pgNo,
      category: product.categoryName
    };

    return this.searchProducts(criteria);
    
  }

  getLatest(perPage: number, pgNo: number): Observable<ProductDTO[] | null>{
    let criteria: SearchCriteriaDTO = {
      searchTerm: "",
      perPage: perPage,
      pageNumber: pgNo,
      creationOrder: SearchSortOrder.ASC
    }

    return this.searchProducts(criteria);

  }

  getLatestByVendor(vendorName: string, perPage: number, pgNo: number): Observable<ProductDTO[] | null>{
    let criteria: SearchCriteriaDTO = {
      searchTerm: "",
      perPage: perPage,
      pageNumber: pgNo,
      vendor: vendorName,
      creationOrder: SearchSortOrder.ASC
    }

    return this.searchProducts(criteria);

  }

  getLatestByCategory(categoryName: string, perPage: number, pgNo: number): Observable<ProductDTO[] | null>{
    let criteria: SearchCriteriaDTO = {
      searchTerm: "",
      perPage: perPage,
      pageNumber: pgNo,
      category: categoryName,
      creationOrder: SearchSortOrder.ASC
    }

    return this.searchProducts(criteria);
  }

  getAllCategories(){
    return this.http.get<Category[]>(this.backendURL + 'product/category')
    .pipe(
      catchError((error) => {
        console.log("Vendor not found", error);
        return of(null);
      })
    );
  }

  // Vendor public data related methods

  getVendorDetails(vendorId: number){
    return this.http.get<Vendor>(this.backendURL + 'vendor/' + vendorId )
    .pipe(
      catchError((error) => {
        console.log("Vendor not found", error);
        return of(null);
      })
    );
  }

  


  // rating related methods

  getAverageRating(productId: number): Observable<number | null> {
    return this.http.get<number>(this.backendURL + '/' + productId.toString() + '/rating')
    .pipe(
      catchError((error) => {
        console.log("Product not found", error);
        return of(null);
      })
    );
  }

  getUserReviews(criteria: ReviewCriteriaDTO) { // returns list of reviews for a product
    console.log("crit:");
    console.log(criteria)
    return this.http.post<ReviewDTO[]>(this.backendURL + 'product/review', criteria)
    .pipe(
      catchError((error) => {
        console.log("Reviews not found", error);
        return of(null);
      })
    );
  }
}