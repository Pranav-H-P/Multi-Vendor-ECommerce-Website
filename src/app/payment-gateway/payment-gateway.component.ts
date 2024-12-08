import { Component, inject, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent implements OnInit{

  userDataService = inject(UserDataService);

  

  ngOnInit(): void {
    
  }


}
