import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { inject } from '@angular/core';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  
  
  
  let token = localStorage.getItem('jwt') || 'asdasdadad';
  if(token){
    req = req.clone({
    setHeaders:{
      'Authorization': 'Bearer ' + token
    }
    })
  }
  return next(req);
};
