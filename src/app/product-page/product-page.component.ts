import { Component, inject, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProductDTO } from '../models';
import { RatingStarsComponent } from "../reusable/rating-stars/rating-stars.component";


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RouterModule, RatingStarsComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent{

  currImage = 0;
  productImageLink = "";

  apiService: ApiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  productId = signal<number>(1);
  productData = signal<ProductDTO | null>(null);

  constructor(){
    
    this.productImageLink = this.apiService.backendURL + 'images/product/';
    
    this.route.params.subscribe(params => {
      this.productId.set(params['id']);
      this.loadProductData();

    });
    
  }


  loadProductData(){
    this.apiService.getProductImageList(this.productId());
    this.apiService.getProductData(this.productId()).subscribe(product => {
      if (product) {
        this.productData.set(product);
      } else {
        this.productData.set(null);
        this.router.navigate(['notfound']);
        
      }
    });
  }
  nextImg(){
    this.currImage = (this.currImage + 1) % this.apiService.currentProductImages().length
  }

  prevImg(){
    this.currImage = (this.currImage - 1)
    if (this.currImage < 0){
      this.currImage = this.apiService.currentProductImages().length - 1;
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


}
