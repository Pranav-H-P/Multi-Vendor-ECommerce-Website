import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { ProductDTO } from '../models';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css'
})
export class WishlistPageComponent implements OnInit{

  userDataService = inject(UserDataService);

  wishList = signal<ProductDTO[]>([]);



  pageNo = signal(0);
  perPage = signal(8);

  ngOnInit(): void {
    
    this.getWishList()
  }


  getWishList(){
    this.userDataService.getWishList(this.pageNo(), this.perPage()).subscribe( list =>{
      if (list){
        this.wishList.set(list);
      }else{
        this.wishList.set([]);
      }
    });
  }

  nextPage(){
    if (this.wishList().length > 0){
      this.pageNo.update( value => value + 1);
      this.getWishList();
    }
  }
  prevPage(){
    if (this.pageNo() > 0){
      this.pageNo.update(value => value - 1);
      this.getWishList();
    }
    
  }


}
