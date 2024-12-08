import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import { ProductDTO } from '../../models';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { RatingStarsComponent } from "../rating-stars/rating-stars.component";
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, NgClass, RatingStarsComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit,OnChanges{

  @Input() productData!: ProductDTO;
  @Input() expanded = true; // text and stuff will be at the bottom for product page cards etc, side for search
  @Input() thisProd = false; // to show effect that its this product (when appearing in similar prod results)

  @Input() quantity: number| undefined;

  imageList = signal<string[]>([]);

  apiService = inject(ApiService);

  imagePick = 0;

  pdSignal = signal<ProductDTO | null>(null); // to pass to rating star component

  ngOnInit(): void {
    this.loadImages();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData']) {
      this.loadImages(); // Reload images when productData changes
      this.pdSignal.set(this.productData);
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

  loadImages(){

    this.apiService.getProductImageList(this.productData.productId).subscribe(list =>{
      if (list){
        this.imageList.set(list);
        this.imagePick = Math.floor(Math.random() * list.length)
      }else{
        this.imageList.set([]);
      }
    });
  }


}
