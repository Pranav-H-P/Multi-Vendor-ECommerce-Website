import { inject, Injectable, signal } from '@angular/core';
import { UserRole } from '../enums';
import { LocalStorageService } from './local-storage.service';
import { AuthRequestDTO, AuthResponseDTO, ProductDTO, RegisterDTO, ReviewType, UserProfile, WishListItem } from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
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

      files.forEach(
        file =>{
          formData.append('file', file, file.name);
        }
      );
      
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

  checkPurchase(prodId: number){
    return this.http.get<ProductDTO[]>(this.backendURL + "customer/checkpurchase/" +prodId,
      {responseType: 'text' as 'json'}
    )
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )
  }
}


