import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import { ProductDTO } from '../../models';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit,OnChanges{

  @Input() productData!: ProductDTO;
  @Input() bottomText = true; // text and stuff will be at the bottom for product page cards etc, side for search

  imageList = signal<string[]>([]);

  apiService = inject(ApiService);

  imagePick = 0;

  ngOnInit(): void {
    this.loadImages();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData']) {
      this.loadImages(); // Reload images when productData changes
    }
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
