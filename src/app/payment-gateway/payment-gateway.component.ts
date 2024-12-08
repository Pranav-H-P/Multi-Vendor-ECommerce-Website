import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from "../reusable/toast/toast.component";
import { Router } from '@angular/router';
import { CartItemDTO } from '../models';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [FormsModule, ToastComponent],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent implements OnInit{

  userDataService = inject(UserDataService);
  router = inject(Router);

  cartItems = signal<CartItemDTO[]>([]);
  totalCost = signal(0);

  cvv: string = "";
  expiry : string = "";
  holderName: string = "";
  cardNo: string = "";


  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);

  ngOnInit(): void {
    this.totalCost.set(0);
    this.userDataService.getCart().subscribe(response => {
      if (response){
        this.cartItems.set(response);
        response.forEach(item => {
          this.totalCost.update(value => value + item.quantity * item.product.price);
        })
      }
    })
  }


  validateData(){
    const cardNumberPattern = /^\d{16}$/;
    const cvvPattern = /^\d{3}$/;
    const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;


    if (!cardNumberPattern.test(this.cardNo)) {
      this.activateToast("Invalid Card Number", false);
      return false;
    }
    if (!cvvPattern.test(this.cvv)) {
      this.activateToast("Invalid CVV", false);
      return false;
    }
    if (!expiryPattern.test(this.expiry)){
      this.activateToast("Invalid Expiry Date", false);
      return false;
    }
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    
    const [month, year] = this.expiry.split('/').map(Number);

        
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.activateToast("The card has expired", false);
      return false;
    }

    this.activateToast("Processing.", true);
    return true;
    
  }

  pay(){
    if (this.validateData()){



      this.userDataService.clearCart().subscribe(resp =>{
        if (resp){

          this.activateToast("Success!!", true);
          

          setTimeout(() => {
            this.router.navigate(['/home']);;
            }, this.toastDuration);

        }else{
          this.activateToast("Failed!", false);
          return;
        }
      });

    }


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

  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }

}
