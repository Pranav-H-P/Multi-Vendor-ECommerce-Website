import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';
import { UserRole } from '../enums';

export const vendorGuard: CanActivateFn = (route, state) => {
  
  
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.userProfile().role?.toString() === "VENDOR"){
    return true;
  }else{
    router.navigate(["notfound"]);
    return false;
  }
};
