import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastComponent } from "../reusable/toast/toast.component";
import { UserDataService } from '../services/user-data.service';
import { Router } from '@angular/router';
import { CartItemDTO } from '../models';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [ToastComponent, ProductCardComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit{



  userDataService = inject(UserDataService);
  router = inject(Router);



  cartItems = signal<CartItemDTO[]>([]);

  totalCost = signal(0);

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);
  
  deleteItem(id: number){
    const pId = this.cartItems()[id];

    this.userDataService.deleteFromCart(pId).subscribe(items =>{
      if (items){
        this.updateCart()
      }
    });
  }


  ngOnInit(): void {
    
    this.updateCart()

  }
  formatToIndianCurrency(value: number | undefined) {
    if (value === null || value === undefined) {
        return '';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
  }



  updateCart(){
    this.userDataService.getCart().subscribe( list =>{
      if (list){
        this.cartItems.set(list);
        this.totalCost.set(0);
        list.forEach(item =>{
          this.totalCost.update(value => value + item.quantity * item.product.price)
        })

      }else{
        this.cartItems.set([]);
      }
    });
  }

  checkOut(){

  }










  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }
}
