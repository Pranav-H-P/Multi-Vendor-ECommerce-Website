import { Injectable, signal } from '@angular/core';
import { CartType } from '../models';
import { UserRole } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  userName = signal("");
  userEmail = signal("");
  userAddress = signal("");
  userRole = signal(UserRole);
  userCart = signal(new Map<string, CartType>());
  userPhone = signal("");

  constructor() { }

}
