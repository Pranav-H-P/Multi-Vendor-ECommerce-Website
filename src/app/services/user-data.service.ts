import { Injectable, signal } from '@angular/core';
import { UserRole } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userId = signal(-1);
  userName = signal("");
  userEmail = signal("");
  userAddress = signal("");
  userRole = signal<UserRole>(UserRole.CUSTOMER);
  userPhone = signal("");

  constructor() { }

}
