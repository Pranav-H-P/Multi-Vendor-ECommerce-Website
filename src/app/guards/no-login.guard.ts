import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';



/* To stop logged in users from logging in again*/
export const noLoginGuard: CanActivateFn = (route, state) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.userProfile().email === ""){
    return true;
  }else{
    router.navigate(["home"]);
    return false;
  }
};
