import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ReviewDTO } from '../../models';
import { ApiService } from '../../services/api.service';
import { RatingStarsComponent } from "../rating-stars/rating-stars.component";
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [RatingStarsComponent, CommonModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent implements OnInit, OnChanges{

  @Input() reviewData!: ReviewDTO;

  rateVal = signal(1);

  apiService: ApiService = inject(ApiService);

  ngOnInit(): void {
    
    this.rateVal.set(this.enumToInt(this.reviewData.rating.toString()));
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviewData']) {
      this.rateVal.set(this.enumToInt(this.reviewData.rating.toString())); // Reload starValue
    }
  }

  enumToInt(st: string){ // without this it's buggy I HAVE NO CLUE WHY. I WASTED 2 HOURS
    if (st == "EXCELLENT"){
      return 5;
    }else if (st == "GOOD"){
      return 4;
    }else if (st == "SATISFACTORY"){
      return 3;
    }else if (st == "POOR"){
      return 2;
    }else{
      return 1;
    }
  }
  
  

}
