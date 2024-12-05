import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { Rating } from '../../enums';
import { ProductDTO } from '../../models';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent{

  @Input() productData = signal<ProductDTO|null>(null); // sometimes it is null due to request latency
  @Input() useProductData = false;
  @Input() starEnum : Rating = Rating.HORRIBLE;
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
