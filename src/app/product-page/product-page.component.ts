import { Component, inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProductDTO } from '../models';
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent{


  currImage = 0;
  productImageLink = "";

  apiService: ApiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  productId: number = 0;
  productData: ProductDTO | null = null;

  constructor(){
    this.productId = Number(this.route.snapshot.params["id"]);
    this.apiService.getProductImageList(this.productId);
    this.productImageLink = this.apiService.backendURL + 'images/product/' + this.productId + '/';
    
    this.apiService.getProductData(this.productId).subscribe(product => {
      if (product) {
        this.productData = product;
        console.log("ooo" + this.productData);
      } else {
        this.productData = null;
        this.router.navigate(['notfound']);
        
      }
    });
  }

  nextImg(){
    this.currImage = (this.currImage + 1) % this.apiService.currentProductImages().length
  }

  prevImg(){
    this.currImage = (this.currImage - 1) % this.apiService.currentProductImages().length
  }

}
