import { inject, Injectable, signal } from '@angular/core';
import { UserRole } from '../enums';
import { LocalStorageService } from './local-storage.service';
import { AuthRequestDTO, AuthResponseDTO, UserProfile } from '../models';
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
      console.log(this.jwt)
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
            console.log("error2")
            this.router.navigate(['login/expired']);
            this.jwt = null;
          }
          
        }else{
          console.log("error1")
          this.router.navigate(['login/expired']);
          this.jwt = null;
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

  logIn(email: string, password: string){ // to recieve jwt from server

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

  getUserData(){ // fill user data
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.jwt
    });

    return this.http.get<UserProfile>(this.backendURL + "auth/userdata", {headers})
        .pipe(
          catchError((error) => {
            console.log(error);
            return of(null);
          })
    )

  }

  setJwt(jwt: string){ // will be called by login page if login is successful
    this.jwt = jwt;
    this.localStorageService.setJWT(jwt);
  }
}
