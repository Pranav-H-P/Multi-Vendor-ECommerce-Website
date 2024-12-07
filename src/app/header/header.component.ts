import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartItemDTO, ProductDTO } from '../models';
import { ToastComponent } from '../reusable/toast/toast.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterModule, ToastComponent, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{


  
  userData = inject(UserDataService);
  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);
  router = inject(Router);

  expandProfile: boolean = false;
  expandCart: boolean = false;
  expandSearch: boolean = false;
  expandHamburger: boolean = false;

  cartSum: number = 0;

  searchTerm = "";

  searchList = signal<ProductDTO[]>([]);
  cartList = signal<CartItemDTO[]>([]);

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);

  ngOnInit(): void {
    // add profile getting steps
  }


  toggleCart(event: MouseEvent){
    event.stopPropagation();

    if (!this.expandCart){ // to be opened
     ;

      this.cartSum = 0;
      this.cartList().forEach(item => {
        this.cartSum += item.product.price * item.quantity;
      });

    }
    this.expandCart = !this.expandCart;
    this.expandProfile = false;
    this.expandSearch = false;
  }

  toggleProfile(event: MouseEvent){
    event.stopPropagation();
    this.expandProfile = !this.expandProfile;
    this.expandCart = false;
    this.expandSearch = false;
  }

  closePopUps(){
    this.expandCart = false;
    this.expandProfile = false;
    this.expandSearch = false;
    
  }

  search(event: MouseEvent | undefined){
    
    event?.stopPropagation();
    this.expandCart = false;
    this.expandProfile = false;
    if (this.searchTerm.trim() !== ""){
      this.router.navigate(['/search/'+this.searchTerm.trim()]);
      this.expandSearch = false;
    }
    
  }

  preFetch(){ // prefetches data and populates popup of search box
    console.log(this.searchList());
    if (this.searchTerm.trim().length > 0){
      this.apiService.getSearchPreview(this.searchTerm.trim()).subscribe( list =>{
        if (list){
          this.searchList.set(list);

          if (this.searchList().length > 0){
            this.expandSearch = true;
          }else{
            this.expandSearch = false;
          }

        }else{
          console.log("No products found");
          this.searchList.set([]);
          this.expandSearch = false;
        }

      });
      
      
    }
  }
  openSearchBox(event: MouseEvent){
    
    event.stopPropagation();
    this.expandCart = false;
    this.expandProfile = false;

    if (this.searchTerm.trim().length > 0){
      this.expandSearch = true;
    }
  }
  openHamburger(){
    this.expandHamburger = true;
  }

  closeHamburger(){
    this.expandHamburger = false;
  }

  logout(){
    this.userData.logOut();
    this.activateToast("Successfully Logged Out!", true);
    this.router.navigate(['login']);

  }

  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }


  isCustomer(){

    return !(this.userData.userProfile().role?.toString() === 'VENDOR'
            || this.userData.userProfile().role?.toString() === 'ADMIN')
  }

  

}
