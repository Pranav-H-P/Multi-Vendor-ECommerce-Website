import { Component, Input, OnChanges, OnInit, Signal, signal, SimpleChanges } from '@angular/core';
import { ProductDTO } from '../../models';
import { Rating } from '../../enums';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent{

  @Input() productData = signal<ProductDTO|null>(null); // sometimes it is null due to request latency
  @Input() useProductData = false; // set as true to use DTO, else it will check for starVal
  @Input() starVal : Rating = Rating.SATISFACTORY;
  @Input() modifiable = false;


  finalCount = 0; // zero indexed for compatibility with enum

  onClicked(id: number){

    if (this.finalCount == id){
      this.finalCount = 0;
    }else{
      this.finalCount = id;
    }

    
  }




}
