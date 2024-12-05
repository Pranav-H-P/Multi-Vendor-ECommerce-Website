import { Component, inject, Inject, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  
  userData = inject(UserDataService);
  apiService = inject(ApiService);
  router = inject(Router);

  expandProfile: boolean = false;
  expandCart: boolean = false;
  expandSearch: boolean = false;
  expandHamburger: boolean = false;

  cartSum: number = 0;

  searchTerm = "";

  toggleCart(event: MouseEvent){
    event.stopPropagation();

    if (!this.expandCart){ // to be opened
     ;

      this.cartSum = 0;
      this.apiService.cartList().forEach(item => {
        this.cartSum += item.price * item.quantity;
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

  search(event: MouseEvent){
    
    event.stopPropagation();
    this.expandCart = false;
    this.expandProfile = false;
    if (this.searchTerm.trim() !== ""){
      this.router.navigate(['/search']);
      this.expandSearch = false;
    }
    
  }

  preFetch(){ // prefetches data and populates popup of search box
    if (this.searchTerm.trim().length > 0){
      this.apiService.loadSearchPreview(this.searchTerm.trim());
      
      if (this.apiService.searchList().length > 0){
        this.expandSearch = true;
      }else{
        this.expandSearch = false;
      }
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

  logout(){ // add later

  }


  

}
