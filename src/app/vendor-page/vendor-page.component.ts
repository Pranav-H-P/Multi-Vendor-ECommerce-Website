import { Component, HostListener, inject, OnChanges, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDTO, Vendor } from '../models';
import { ApiService } from '../services/api.service';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";

@Component({
  selector: 'app-vendor-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './vendor-page.component.html',
  styleUrl: './vendor-page.component.css'
})
export class VendorPageComponent{

  route: ActivatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);

  vendorId: number;

  latestList = signal<ProductDTO[]>([]);

  latestPageNo = signal(0);
  latestPerPage = signal(5);
  lastPageNo = -1;

  vendorData = signal<Vendor | null>(null);
  
  vendorMobile = signal<string>(""); // just for display, so to be on the safer side incase of some input error
  vendorEmail = signal<string>("");

  constructor(){
    this.vendorId = Number(this.route.snapshot.params["id"]);
    this.apiService.getVendorDetails(this.vendorId).subscribe(data =>{
      if (data){
        this.vendorData.set(data);

        const vendorContacts = data.contactDetails.split(",")
        this.vendorEmail.set(vendorContacts[0]);
        this.vendorMobile.set(vendorContacts[1]);

        this.getLatestProducts(this.getPerPageCount());
      }else{
        console.log("Error, was not able to get vendor data");
      }
    });
  }
  
  getLatestProducts(perPage: number){
    if (perPage == this.latestList().length && // to prevent spamming the server, check product page.ts for more info
        this.latestPageNo() == this.lastPageNo){
      return
    }
    this.apiService.getLatestByVendor(this.vendorData()?.name ?? "", perPage,this.latestPageNo())
    .subscribe( list =>{
      if (list){
        this.latestList.set(list);
        this.lastPageNo = this.latestPageNo();
      }else{
        this.latestList.set([]);
      }
    });
  }
  
  nextLatestPage(){
    if (this.latestList().length > 0){
      this.latestPageNo.update( value => value + 1);
      this.getLatestProducts(this.getPerPageCount());
    }
  }

  prevLatestPage(){
    if (this.latestPageNo() > 0){
      this.latestPageNo.update(value => value - 1);
      this.getLatestProducts(this.getPerPageCount());
    }
  }


  getPerPageCount(){

    if (window.innerWidth >= 1280){
        return 5;
    }else if (window.innerWidth >= 1020){
        return 4;
    }else if (window.innerWidth >= 850){
        return 3;
    }else{
        return 6;
    }
    
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.getLatestProducts(this.getPerPageCount());
  }

}
