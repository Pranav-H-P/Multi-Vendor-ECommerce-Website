import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { inject } from '@angular/core';


/*redirect all types of users to their respective home pages*/

export const homepageGuard: CanActivateFn = (route, state) => {
  
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  
  if (userDataService.userProfile().role?.toString() === "ADMIN"){
    router.navigate(["admin/dashboard"]);
    return false;
  }else if (userDataService.userProfile().role?.toString() === "VENDOR"){
    router.navigate(["vendor/dashboard"]);
    return false;
  }else{
    return true;
  }
};
