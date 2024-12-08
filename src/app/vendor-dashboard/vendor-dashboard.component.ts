import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ProductDTO, SearchCriteriaDTO, Vendor } from '../models';
import { UserDataService } from '../services/user-data.service';
import { ToastComponent } from "../reusable/toast/toast.component";
import { VendorApprovalStatus } from '../enums';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [ToastComponent, ProductCardComponent, RouterLink],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent implements OnInit{


  apiService = inject(ApiService);
  userDataService = inject(UserDataService);



  vendorProfileData = signal<Vendor>({
    name: "",
    approvalStatus: VendorApprovalStatus.PENDING,
    id: -1,
    joinDate: new Date(),
    description: "",
    contactDetails: ""
  });
  
  productList = signal<ProductDTO[]>([]);


  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);


  pageNo = signal(0);
  perPage = 10;

  ngOnInit(): void {
    
    this.apiService.getVendorDetails(this.userDataService.userProfile().id)
    .subscribe(vend =>{
      if (vend){
        this.vendorProfileData.set(vend);
        
        this.loadProducts();
      }
    });

  }

  loadProducts(){

    const criteria: SearchCriteriaDTO = {
      searchTerm: "",
      vendor: this.userDataService.userProfile().name,
      pageNumber: this.pageNo(),
      perPage: this.perPage
    }
    
    this.apiService.searchProducts(criteria).subscribe(list =>{
      if (list){
        this.productList.set(list);
      }else{
        this.productList.set([]);
      }
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

  nextPage(){
    if (this.productList().length > 0){
      this.pageNo.update( value => value + 1);
      this.loadProducts();
    }
  }
  prevPage(){
    if (this.pageNo() > 0){
      this.pageNo.update(value => value - 1);
      this.loadProducts();
    }
    
  }

}
