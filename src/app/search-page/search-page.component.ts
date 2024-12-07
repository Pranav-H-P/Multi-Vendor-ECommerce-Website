import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Category, ProductDTO, SearchCriteriaDTO, Vendor } from '../models';
import { ToastComponent } from "../reusable/toast/toast.component";
import { NgClass } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";
import { SearchSortOrder } from '../enums';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ToastComponent, NgClass, FormsModule, ProductCardComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit{



  ASC_ORDER = SearchSortOrder.ASC; // template cannot access SearchSortOrder, so for readability
  DSC_ORDER = SearchSortOrder.DSC; 
  NONE_ORDER = SearchSortOrder.NONE;

  apiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);

  productImageLink = "";

  searchPageNo = signal(0);
  searchPerPage = signal(8);

  searchResults = signal<ProductDTO[]>([]);
  previousSearchTerm = signal("");

  currentSearchTerm = "";

  lastPageNo = -1;


  showCatSelect = false;
  showVendorSelect = false;

  vendorList = signal<Vendor[]>([]);
  categoryList = signal<Category[]>([]);

  showFilter = signal(false);
  
  // filter vars

  vendorName: string = "All";

  categoryName: string = "All";

  vendorPageNo: number = 0; // for pagination

  minPrice: string = ""; 
  maxPrice: string = "";
  priceOrder: SearchSortOrder = SearchSortOrder.NONE;
  
  ratingOrder: SearchSortOrder = SearchSortOrder.NONE;


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

    this.apiService.getAllCategories().subscribe( cats =>{
      if (cats){
        this.categoryList.set(cats);
      }else{
        this.categoryList.set([]);
      }
    });
  }


  validNumber(st: string){
    st = st.trim()
    if (st === ""){
      return true; // empty string, not going to be used for filter
    }

    const number = parseFloat(st);
    
    return !isNaN(number) && isFinite(number) && number >= 0;
  }

  changePriceOrder(order: SearchSortOrder){

    if (order == this.priceOrder){ // if its the already selected one, deselect
      this.priceOrder = SearchSortOrder.NONE;
    }else{
      this.priceOrder = order;
    }
    
  }

  changeRatingOrder(order: SearchSortOrder){

    if (order == this.ratingOrder){ // if its the already selected one, deselect
      this.ratingOrder = SearchSortOrder.NONE;
    }else{
      this.ratingOrder = order;
    }
    
  }


  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }

  changeVendorName(st: string){
    if (this.vendorName === st){
      this.vendorName = "All";
    }else{
      this.vendorName = st;
    }
  }


  getVendorList(){
    this.apiService.getVendorList(this.vendorPageNo, this.categoryList().length) // get same amount of entries as category list
      .subscribe(list =>{
        if (list){
          this.vendorList.set(list);
        }else{
          this.vendorList.set([]);
        }
      });
  }

  toggleVendorSelect(){
    this.showVendorSelect = !this.showVendorSelect;
    if (this.showVendorSelect){
       this.getVendorList()
    }
  }

  changeCategoryName(st: string){
    if (this.categoryName === st){
      this.categoryName = "All";
    }else{
      this.categoryName = st;
    }
  }

  toggleCatSelect(){
    this.showCatSelect = !this.showCatSelect;
  }


  getValidatedCriteria(): SearchCriteriaDTO | null{

    if (!(this.validNumber(this.minPrice) && this.validNumber(this.maxPrice))){
      this.activateToast("Minimum and Maximum prices are not valid!" ,false);
      return null;
    }

    let criteria: SearchCriteriaDTO = {
      searchTerm: this.currentSearchTerm,
    }

    if (this.vendorName !== "All"){
      criteria.vendor = this.vendorName;
    }
    if (this.categoryName !== "All"){
      criteria.category = this.categoryName;
    }

    if (this.minPrice.trim() !== ""){
      criteria.minPrice = Number(this.minPrice); // will be validated to be a number with html
    }
    if (this.maxPrice.trim() !== ""){
      criteria.maxPrice = Number(this.maxPrice); // will be validated to be a number with html
    }

    criteria.priceOrder = this.priceOrder;
    criteria.ratingOrder = this.ratingOrder;

    criteria.pageNumber = this.searchPageNo();
    criteria.perPage = this.searchPerPage();

    return criteria;
  }

  getSearch(){

    if (this.currentSearchTerm.trim() === ""){
      this.activateToast("Input is empty!", false);
      return;
    }

    let criteria: SearchCriteriaDTO | null = this.getValidatedCriteria();

    if (criteria == null){
      return
    }
    console.log("eee")
    console.log(criteria);
    this.apiService.searchProducts(criteria).subscribe(results => {
      if (results) {
        this.searchResults.set(results);
        console.log(results);
        
      } else {
        this.searchResults.set([]);
        
      }
      this.previousSearchTerm.set(this.currentSearchTerm);
    });
  }


  toggleFilters(){
    this.showFilter.update(value => !value);
  }


  nextVendorPage(){
    if (this.vendorList().length > 0){
      this.vendorPageNo += 1;
      this.getVendorList();
    }
  }
  prevVendorPage(){
    if (this.vendorPageNo > 0){
      this.vendorPageNo -= 1;
      this.getVendorList();
    }
    
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
