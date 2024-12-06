import { inject, Injectable, signal } from '@angular/core';
import { UserRole } from '../enums';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  localStorageService = inject(LocalStorageService);

  userId = signal(-1);
  userName = signal("");
  userEmail = signal("");
  userAddress = signal("");
  userRole = signal<UserRole>(UserRole.CUSTOMER);
  userPhone = signal("");

  constructor() {
    if (this.localStorageService.getJWT()){
      // add logic to check if jwt is valid and if yes then retrieve user data
    }
  }

}
