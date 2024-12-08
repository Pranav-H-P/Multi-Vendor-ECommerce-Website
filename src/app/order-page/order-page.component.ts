import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { OrderDTO } from '../models';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css'
})
export class OrderPageComponent implements OnInit{

  userDataService = inject(UserDataService);


  orderList = signal<OrderDTO[]>([]);

  imageList = signal<string[]>([]);

  apiService = inject(ApiService);

  imagePick = 0;



  pageNo = signal(0);
  perPage = 10; // not gonna change


  ngOnInit(): void {
    
    this.loadOrderList();

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

  

  loadOrderList(){
    this.userDataService.getOrderList(this.pageNo(), this.perPage).subscribe( resp => { 
      if (resp){
        this.orderList.set(resp);
      }else{
        this.orderList.set([]);
      }
    });
  }



  nextPage(){
    if (this.orderList().length > 0){
      this.pageNo.update( value => value + 1);
      this.loadOrderList();
    }
  }
  prevPage(){
    if (this.pageNo() > 0){
      this.pageNo.update(value => value - 1);
      this.loadOrderList();
    }
    
  }
}
