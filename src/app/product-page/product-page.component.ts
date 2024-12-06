import { Component, HostListener, Inject, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ProductDTO, ReviewCriteriaDTO, ReviewDTO } from '../models';
import { RatingStarsComponent } from "../reusable/rating-stars/rating-stars.component";
import { UserDataService } from '../services/user-data.service';
import { ProductCardComponent } from '../reusable/product-card/product-card.component';
import { SearchSortOrder } from '../enums';


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
  similarPerPage = signal<number>(4);

  reviewPageNo = signal(0);
  reviewPerPage = signal(5);

  imageList = signal<string[]>([]);
  similarProducts = signal<ProductDTO[]>([]);
  userReviews = signal<ReviewDTO[]>([]);

  productCartWidth = 160 + 100; // second number for margin of error

  lastPageNo = -1; // when similar products were fetched last (to reduce no of calls)

  resizeBreakpoints = [
    

    ,840//3
    ,1020//5
    ,1280//4
  ];

  ngOnInit(){
    
    this.route.params.subscribe(params => {
      console.log("init")    
      this.productImageLink = this.apiService.backendURL + 'images/product/';
      this.productId.set(params['id']);
      this.lastPageNo = -1;
      this.similarPageNo.set(0);
      this.loadProductData();
      this.loadUserReviews();
      
    });
    
  }

  loadSimilarProducts(perPage: number){ 
    
    if (perPage == this.similarProducts().length && 
        this.similarPageNo() == this.lastPageNo){
      return
    }

    this.apiService.loadSimilar(this.productData(),
      perPage, this.similarPageNo())?.subscribe(pList => {

      if (pList) {
        this.similarProducts.set(pList);
        this.lastPageNo = this.similarPageNo();
        console.log(pList);
        
      } else {
        this.similarProducts.set([]);
      }
    }
      
    );
  }

  loadUserReviews(timeOrder?: SearchSortOrder,
                  ratingOrder?: SearchSortOrder
  ){

    let criteria: ReviewCriteriaDTO = {
      productId: this.productId(),
      pageNumber: this.reviewPerPage(),
      perPage: this.reviewPageNo(),
      timeOrder: timeOrder,
      ratingOrder: ratingOrder
    }

    this.apiService.loadUserReviews(criteria).subscribe(rList =>{

        if (rList){
          this.userReviews.set(rList);
        }else{
          this.userReviews.set([]);
        }

      });
  }

  loadImages(){
    this.apiService.getProductImageList(this.productId()).subscribe(list =>{
      if (list){
        this.imageList.set(list);
      }else{
        this.imageList.set([]);
      }
    });
  }

  loadProductData(){
    this.apiService.getProductData(this.productId()).subscribe(product => {
      if (product) {
        this.productData.set(product);
        this.loadImages();
        this.loadSimilarProducts(this.getPerPageCount());
      } else {
        this.productData.set(null);
        this.router.navigate(['notfound']);
        
      }
    });
  }
  nextImg(){
    this.currImage = (this.currImage + 1) % this.imageList().length
    
  }

  prevImg(){
    this.currImage = (this.currImage - 1)
    if (this.currImage < 0){
      this.currImage = this.imageList().length - 1;
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
      this.loadSimilarProducts(this.getPerPageCount());
    }
  }
  prevProductPage(){
    if (this.similarPageNo() > 0){
      this.similarPageNo.update(value => value - 1);
      this.loadSimilarProducts(this.getPerPageCount());
    }
    
  }

  getPerPageCount(){

    if (window.innerWidth >= 1280){
        return 5;
    }else if (window.innerWidth >= 1020){
        return 4;
    }else if (window.innerWidth >= 850){
        return 3;
    }else{
        return 6;
    }
    
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    
    this.loadSimilarProducts(this.getPerPageCount());
  }
  

}