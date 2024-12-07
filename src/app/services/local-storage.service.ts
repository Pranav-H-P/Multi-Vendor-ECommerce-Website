import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  removeJWT(){// for logging out
    localStorage.removeItem('jwt');
  }

  setJWT(token: string){
    localStorage.setItem('jwt', token);
  }
  getJWT(){
    const jwt = localStorage.getItem('jwt'); // stored just as a string
    
    if (jwt){
      return jwt;
    }else{
      return null;
    }
  }

}
