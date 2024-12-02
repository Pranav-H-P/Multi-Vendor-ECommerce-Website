import { Component, inject, Inject, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  searchTerm = "";
  userData = inject(UserDataService);
  apiService = inject(ApiService);

  expandProfile: boolean = false;
  expandCart: boolean = false;
  expandSearch: boolean =false;


  searchPreviews: string[] = [];
  cartPreviews: any[][] = []; // make datatypes for this

  cartSum = 0;

  constructor(){

  }

  toggleCart(event: MouseEvent){
    event.stopPropagation();

    if (!this.expandCart){ // to be opened
      this.cartPreviews = this.apiService.getCart();

      this.cartSum = 0;
      this.cartPreviews.forEach(element => {
        this.cartSum += element[1]*element[2];
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
  }

  preFetch(){ // prefetches data and populates popup of search box
    if (this.searchTerm.trim().length > 0){
      this.searchPreviews = this.apiService.getSearchPreview(this.searchTerm.trim());
      this.expandSearch = true;
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


}
