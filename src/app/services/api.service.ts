import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  setJWT(token: string){
    localStorage.setItem('jwt', token);
  }
  getJWT(){
    const jwt = localStorage.getItem('jwt'); // stored just as a string
  }
}
