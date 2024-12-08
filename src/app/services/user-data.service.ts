import { inject, Injectable, signal } from '@angular/core';
import { UserRole, VendorApprovalStatus } from '../enums';
import { LocalStorageService } from './local-storage.service';
import { AuthRequestDTO, AuthResponseDTO, CartItemDTO, CartSubmit
  , OrderDTO, ProductDTO, ProductType, RegisterDTO, ReviewType, UserProfile, Vendor, WishListItem } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

/*Service for holding user data and account related APIs*/


export class UserDataService {


  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);
  apiService = inject(ApiService);
  router = inject(Router);

  
  backendURL = "";
  
  cartLength = signal(0);
  
  userProfile = signal<UserProfile>({
    name: "",
    id: -1,
    email: "",
    address: "",
    role: undefined,
    phoneNumber: -1

  })

  jwt = this.localStorageService.getJWT()


  constructor() {

    this.backendURL = this.apiService.backendURL;
    

    if (this.jwt){ // jwt exists
      this.refreshToken().subscribe(response =>{
        if (response){

          if (response.err == null){
            this.jwt = response.jwt;

            this.getUserData().subscribe(data=>{
              if (data){

                this.userProfile.set(data);
                this.getCart().subscribe( resp =>{
                  if (resp){
                    this.cartLength.set(resp.length);
                  }
                }

                ); // for header updation
                this.router.navigate(['/home']);
  
              }else{
                console.error("User not Found!"); // i dont think this is ever possible
              }
            });

          }else{
            this.router.navigate(['login/expired']);
            this.jwt = null;
            this.logOut()
          }
          
        }else{
          this.router.navigate(['login/expired']);
          this.jwt = null;
          this.logOut()
        }
      });


    }
  }

  refreshToken(){ // renews old jwt if not expired yet

    const headers = new HttpHeaders();

    return this.http.post<AuthResponseDTO>(this.backendURL + "auth/testtoken", {
        headers: {
        'Authorization': 'Bearer lmaooo',
        'Content-Type': 'application/json'
      }
    })
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    );
  }

  login(email: string, password: string){ // to recieve jwt from server

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const userCredentials: AuthRequestDTO = {
      email: email,
      password: password
    }

    return this.http.post<AuthResponseDTO>(this.backendURL + 'auth/login', userCredentials, {headers})
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )

    
  }

  register(registerData: RegisterDTO){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<AuthResponseDTO>(this.backendURL + 'auth/register', registerData, {headers})
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )

    
  }

  getUserData(){ // fill user data
    

    return this.http.get<UserProfile>(this.backendURL + "auth/userdata")
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )

  }

  refreshUserData(){
    this.getUserData().subscribe(data=>{
      if (data){
        this.userProfile.set(data);
      }
    })
  }

  logOut(){
    this.localStorageService.removeJWT();
    this.userProfile = signal<UserProfile>({
      name: "",
      id: -1,
      email: "",
      address: "",
      role: undefined,
      phoneNumber: -1
  
    })
  }

  setJwt(jwt: string){ // will be called by login page if login is successful
    this.jwt = jwt;
    this.localStorageService.setJWT(jwt);
  }

  updateAddress(address: string){
    return this.http.post<string>(this.backendURL + "customer/updateaddress", address, {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' as 'json'
    }).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }
  
  
  uploadProductPictures(files: File[], productId: number){

    if (files != null){

      const formData: FormData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      formData.append("id", productId.toString());
  
      return this.http.post<string>(this.backendURL + "images/uploadproductimage", formData,
        {responseType: 'text' as 'json'}
      ).pipe(
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );

    }else{
      return of(null);
    }

  }

  uploadProfilePicture(file: File | null){

    if (file != null){

      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
  
      return this.http.post<string>(this.backendURL + "images/uploaduserimage", formData,
        {responseType: 'text' as 'json'}
      ).pipe(
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );

    }else{
      return of(null);
    }

  }

  addWishListItem(item: WishListItem){
    return this.http.post<string>(this.backendURL + "customer/addwishlist", item,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  removeWishListItem(item: WishListItem){
    return this.http.post<string>(this.backendURL + "customer/removewishlist", item,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }
  getWishList(pageNo: number, perPage: number){
    return this.http.get<ProductDTO[]>(this.backendURL + "customer/getwishlist/" + pageNo + "/" + perPage,)
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )
  }
  checkWishlistItem(prodId: number){
    return this.http.get<string>(this.backendURL + "customer/wishlistexists/" + prodId,
      {responseType: 'text' as 'json'}
    )
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )
  }

  postReview(reviewObj: ReviewType){
    return this.http.post<string>(this.backendURL + "customer/postreview", reviewObj,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );

  }

  addToCart(item: CartSubmit){
    return this.http.post<string>(this.backendURL + "customer/addtocart", item,
      {responseType: 'text' as 'json'}
    
    ).pipe(tap(response => {
      
      this.getCart().subscribe( response=>{
        if (response){
          this.cartLength.set(response.length); // for header icon to update

        }
      });
      
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  
  }

  deleteFromCart(item: CartItemDTO){
    return this.http.post<string>(this.backendURL + "customer/deletefromcart", item,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  getCart(){
    return this.http.get<CartItemDTO[]>(this.backendURL + "customer/getcart")
    .pipe(tap(response => {

          this.cartLength.set(response.length); // for header icon to update

      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    )
  }
  clearCart(){
    return this.http.get<string>(this.backendURL + "customer/clearcart", 
      {responseType: 'text' as 'json'}
    ).pipe(tap(response => {

      this.cartLength.set(0); // for header icon to update

  }),
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  placeOrders(list: CartItemDTO[]){
    return this.http.post<string>(this.backendURL + "customer/placeorder", list,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  getOrderList(pageNo: number, perPage: number){
    return this.http.get<OrderDTO[]>(this.backendURL + "customer/getorder/" + pageNo + "/" + perPage
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  checkPurchase(prodId: number){
    return this.http.get<string>(this.backendURL + "customer/purchased/" + prodId,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  getPendingVendors(){
    return this.http.get<Vendor[]>(this.backendURL + "admin/vendorrequests"
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  
  }

  mutateVendor(vendor: Vendor){

    return this.http.post<string>(this.backendURL + "admin/approvevendor", vendor,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  approveVendor(vendor: Vendor){

    vendor.approvalStatus = VendorApprovalStatus.APPROVED;

    return this.mutateVendor(vendor);
  }

  rejectVendor(vendor: Vendor){

    vendor.approvalStatus = VendorApprovalStatus.REJECTED;

    return this.mutateVendor(vendor);

  }

  saveProduct(prod: ProductType){
    return this.http.post<string>(this.backendURL + "product/save", prod,
      {responseType: 'text' as 'json'}
    ).pipe(
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

}


