import { Component, HostListener, Inject, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProductDTO, ReviewDTO } from '../models';
import { RatingStarsComponent } from "../reusable/rating-stars/rating-stars.component";
import { UserDataService } from '../services/user-data.service';
import { ProductCardComponent } from '../reusable/product-card/product-card.component';


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RouterModule, RatingStarsComponent, ProductCardComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit{

  currImage = 0;
  productImageLink = "";

  

  itemCount = 0;

  userService: UserDataService = inject(UserDataService);
  apiService: ApiService = inject(ApiService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  productId = signal<number>(1);
  productData = signal<ProductDTO | null>(null);

  similarPageNo = signal(0);
  similarPerPage = signal(5);

  reviewPageNo = signal(0);
  reviewPerPage = signal(6);

  similarProducts = signal<ProductDTO[]>([]);
  userReviews = signal<ReviewDTO[]>([]);

  private resizeObserver!: ResizeObserver;

  ngOnInit(){
    
    this.productImageLink = this.apiService.backendURL + 'images/product/';
    
    this.route.params.subscribe(params => {
      this.productId.set(params['id']);
      this.loadProductData();
      this.loadUserReviews();
      
    });
    
  }

  loadSimilarProducts(){
    this.apiService.loadSimilar(this.productData(),
      this.similarPerPage(), this.similarPageNo())?.subscribe(pList => {

      if (pList) {
        this.similarProducts.set(pList);
        
      } else {
        this.similarProducts.set([]);
      }
    }
      
    );
  }

  loadUserReviews(){
    this.apiService.loadUserReviews(this.productId(),
      this.reviewPerPage(),this.reviewPageNo()).subscribe(rList =>{

        if (rList){
          this.userReviews.set(rList);
        }else{
          this.userReviews.set([]);
        }

      });
  }

  loadProductData(){
    this.apiService.getProductImageList(this.productId());

    this.apiService.getProductData(this.productId()).subscribe(product => {
      if (product) {
        this.productData.set(product);
        this.loadSimilarProducts();

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

  addToCart(){
    if (this.userService.userEmail() === ""){
      this.router.navigate(['login']);
    }else{
      // add cart api logic
    }
  }

  increment(){
    this.itemCount += 1;
  }

  decrement(){
    if (this.itemCount > 0){
      this.itemCount -= 1;
    }
  }
  
  nextProductPage(){
    if (this.similarProducts().length > 0){
      this.similarPageNo.update( value => value + 1);
      this.loadSimilarProducts();
    }
  }
  prevProductPage(){
    if (this.similarPageNo() > 0){
      this.similarPageNo.update(value => value - 1);
      this.loadSimilarProducts();
    }
    
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // add pageination logic too
    this.loadSimilarProducts();
  }


}
