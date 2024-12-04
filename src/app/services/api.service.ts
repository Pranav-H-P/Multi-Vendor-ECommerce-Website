import { inject, Injectable, signal } from '@angular/core';
import { CartItemDTO, ProductDTO, SearchCriteriaDTO } from '../models';
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
  
  currentProductImages = signal<string[]>([]);

  // image related methods
  getProductImageList(id: number){
    console.log(id);
    this.http.get<string[]>(this.backendURL + 'images/product/' + id.toString())
      .subscribe({
        next: (response) => {
          this.currentProductImages.set(response.sort());
        },
        error: (error) => {
          console.log("Image for product not found!", error);
        }
      });
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

}
