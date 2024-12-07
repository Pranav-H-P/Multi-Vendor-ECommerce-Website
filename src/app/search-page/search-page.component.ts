import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDTO, SearchCriteriaDTO } from '../models';
import { ToastComponent } from "../reusable/toast/toast.component";
import { NgClass } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ToastComponent, NgClass, FormsModule, ProductCardComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit{



  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);

  productImageLink = "";

  searchPageNo = signal(0);
  searchPerPage = signal(8);

  searchResults = signal<ProductDTO[]>([]);
  previousSearchTerm = signal("");

  currentSearchTerm = "";

  lastPageNo = -1;

  showFilter = signal(false);

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);
  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productImageLink = this.apiService.backendURL + 'images/product/';
      this.currentSearchTerm = params['term'];
      this.lastPageNo = -1;
      this.searchPageNo.set(0);
      this.getSearch();
    });
  }

  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }


  getSearch(){

    if (this.currentSearchTerm.trim() === ""){
      this.activateToast("Input is empty!", false);
      return;
    }

    let criteria: SearchCriteriaDTO = {
      searchTerm: this.currentSearchTerm
    }

    this.apiService.searchProducts(criteria).subscribe(results => {
      if (results) {
        this.searchResults.set(results);
        
      } else {
        this.searchResults.set([]);
        
      }
      this.previousSearchTerm.set(this.currentSearchTerm);
    });
  }


  toggleFilters(){
    this.showFilter.update(value => !value);
  }

  nextSearchPage(){
    if (this.searchResults().length > 0){
      this.searchPageNo.update( value => value + 1);
      this.getSearch();
    }
  }
  prevSearchPage(){
    if (this.searchPageNo() > 0){
      this.searchPageNo.update(value => value - 1);
      this.getSearch();
    }
    
  }

}
