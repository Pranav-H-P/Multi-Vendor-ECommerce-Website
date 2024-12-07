import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { UserRole } from '../enums';



/* To stop logged out users from accessing cart and stuff*/
export const loginGuard: CanActivateFn = (route, state) => {
  
  
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.userProfile().email !== ""){
    return true;
  }else{
    router.navigate(["login"]);
    return false;
  }
};
