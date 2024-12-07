import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';
import { UserRole } from '../enums';

export const adminGuard: CanActivateFn = (route, state) => {
  
  
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.userProfile().role?.toString() === "ADMIN"){
    return true;
  }else{
    router.navigate(["notfound"]);
    return false;
  }


};
