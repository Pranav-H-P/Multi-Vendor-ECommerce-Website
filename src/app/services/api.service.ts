import { inject, Injectable, signal } from '@angular/core';
import { CartItemDTO, ProductDTO, ReviewCriteriaDTO, ReviewDTO, SearchCriteriaDTO } from '../models';
import { LocalStorageService } from './local-storage.service';
import { UserDataService } from './user-data.service';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  backendURL:string = "http://localhost:8080/api/"

  http = inject(HttpClient)
  localStorageService = inject(LocalStorageService)
  userDataService = inject(UserDataService)


  constructor() { }


  cartList = signal<CartItemDTO[]>([]);

  searchList = signal<ProductDTO[]>([]);

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

  searchProducts(criteria: SearchCriteriaDTO){
    this.http.post<ProductDTO[]>(this.backendURL + 'product/search', criteria)
      .subscribe({
        next: (response) => {
          this.searchList.set(response);
        },
        error: (error) => {
          this.searchList.set([]);
        }
      });
  }

  loadSearchPreview(itemName: string){ // for homebar search

    let criteria: SearchCriteriaDTO = {
      searchTerm: itemName,
      perPage: 6
    };
    this.searchProducts(criteria)
  }

  loadSearchResults(){

  }

  getProductData(id: number): Observable<ProductDTO | null> {
    return this.http.get<ProductDTO>(this.backendURL + 'product/' + id.toString())
    .pipe(
      catchError((error) => {
        console.log("Product not found", error);
        return of(null);
      })
    );
  }

  loadSimilar(product: any, perPage: number, pgNo: number) {

    if (product === null || product === undefined){
      return;
    }

    let criteria: SearchCriteriaDTO = {
      searchTerm: "",
      perPage: perPage,
      pageNumber: pgNo,
      category: product.categoryName
    };

    return this.http.post<ProductDTO[]>(this.backendURL + 'product/search', criteria)
    .pipe(
      catchError((error) => {
        console.log("Products not found", error);
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

  loadUserReviews(criteria: ReviewCriteriaDTO) {
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
