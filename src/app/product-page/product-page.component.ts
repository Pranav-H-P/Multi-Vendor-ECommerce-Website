import { Component, HostListener, Inject, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CartSubmit, ProductDTO, ReviewCriteriaDTO, ReviewDTO, ReviewType, WishListItem } from '../models';
import { RatingStarsComponent } from "../reusable/rating-stars/rating-stars.component";
import { UserDataService } from '../services/user-data.service';
import { ProductCardComponent } from '../reusable/product-card/product-card.component';
import { Rating, SearchSortOrder } from '../enums';
import { ReviewCardComponent } from "../reusable/review-card/review-card.component";
import { NgClass } from '@angular/common';
import { ToastComponent } from "../reusable/toast/toast.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [RouterModule, RatingStarsComponent, ProductCardComponent,
    ReviewCardComponent, NgClass, ToastComponent, FormsModule],
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
  reviewPerPage = signal(6);

  wishListStatus = signal(false);
  openReviewWriter = signal(false);

  purchased = signal(false); // to check if person has actually bought the item before writing review

  imageList = signal<string[]>([]);
  similarProducts = signal<ProductDTO[]>([]);
  userReviews = signal<ReviewDTO[]>([]);


  newComment = "";
  newRating = Rating.SATISFACTORY;

  byAscending = false;

  byDate = true;

  lastPageNo = -1; // when similar products were fetched last (to reduce no of calls)

  byDateText = ["Latest", "Oldest"]; // sort order text for date option
  byRatingText = ["Highest", "Lowest"]; // sort order text for date option
  orderText = this.byDateText;

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);

  ngOnInit(){
    
    this.route.params.subscribe(params => {
      
      this.productImageLink = this.apiService.backendURL + 'images/product/';
      this.productId.set(params['id']);
      this.lastPageNo = -1;
      this.similarPageNo.set(0);
      this.loadProductData();
      this.loadUserReviews();

      if (this.userService.userProfile().email !== ""){
        this.userService.checkWishlistItem(this.productId()).subscribe(
          response =>{
            if (response){
              this.wishListStatus.set(true);
              this.checkIfOrdered() // check if user has bought product to allow review writing

            }else{
              this.wishListStatus.set(false);
            }
          }
        );
      }
      
    });
    
  }


  setRating(val: number){
    this.newRating = val;
    console.log(this.newRating);
  }

  toggleWriteReview(){
    this.checkIfOrdered()
    
    if (!this.purchased()){
      this.activateToast("You need to purchase the item before reviewing!", false);
      return;
    }

    this.openReviewWriter.update(value => !value);
  }


  toggleWishlist(){
    
    
    const wLItem: WishListItem = {
      userId: this.userService.userProfile().id,
      productId: this.productId(),
      dateAdded: new Date()
    }

    if (this.wishListStatus()){ // removing
      this.userService.removeWishListItem(wLItem).subscribe( resp =>{
        if (resp){
          console.log(resp)
          this.wishListStatus.set(false);
        }
      });

    }else{
      this.userService.addWishListItem(wLItem).subscribe( resp =>{
        if (resp){
          console.log(resp)
          this.wishListStatus.set(true);
        }
      });

    }
    
  }


  loadSimilarProducts(perPage: number){ 
    
    if (perPage == this.similarProducts().length && // to prevent spamming the server
        this.similarPageNo() == this.lastPageNo){   // if required per page is the same as already present
          
          return                                    // and current call page number is equal to page number of last call
                                                    // (basically just a repeat call)
    }

    this.apiService.getSimilar(this.productData(),
      perPage, this.similarPageNo())?.subscribe(pList => {

      if (pList) {
        this.similarProducts.set(pList);
        this.lastPageNo = this.similarPageNo();
        
        
      } else {
        this.similarProducts.set([]);
      }
    }
      
    );
  }

  submitUserReview(){
    if (this.newRating == 0){
      this.activateToast("You need to choose a rating!", false);
      return;
    }else{
      const reviewObj: ReviewType = {
        userId: this.userService.userProfile().id,
        productId: this.productId(),
        rating: this.newRating,
        comment:this.newComment,
        reviewDate: new Date() 
      }

      this.userService.postReview(reviewObj).subscribe(
        resp=>{
          if (resp){
            this.activateToast("Successfully uploaded!", true);
            this.newComment = "";
            this.newRating = 0;
            this.openReviewWriter.set(false);

          }else{
            this.activateToast("Something went wrong!", false);
          }
        }
      );
    }
  }

  loadUserReviews(){

    let timeOrder:SearchSortOrder | undefined  = SearchSortOrder.ASC;
    let ratingOrder:SearchSortOrder | undefined = SearchSortOrder.ASC;

    if (this.byDate){
      if (this.byAscending){
        timeOrder = SearchSortOrder.ASC;
        
      }else{
        timeOrder = SearchSortOrder.DSC;
      }
      ratingOrder = undefined;
    }else{
      if (this.byAscending){
        ratingOrder = SearchSortOrder.ASC;
      }else{
        ratingOrder = SearchSortOrder.DSC;
      }
      timeOrder = undefined;
    }

    let criteria: ReviewCriteriaDTO = {
      productId: this.productId(),
      pageNumber: this.reviewPageNo(),
      perPage: this.reviewPerPage(),
      timeOrder: timeOrder,
      ratingOrder: ratingOrder
    }

    this.apiService.getUserReviews(criteria).subscribe(rList =>{

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

  activateToast(msg: string,success: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(success);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }

  addToCart(){
    if (this.userService.userProfile().email === ""){

      this.router.navigate(['login']);

    }else{
      
      if (this.itemCount > 0 && this.itemCount <= (this.productData()?.stock ?? 0)){

        const cartItem: CartSubmit = {
          userId: this.userService.userProfile().id,
          productId: this.productId(),
          dateAdded: new Date(),
          quantity: this.itemCount
          
        }
        this.userService.addToCart(cartItem).subscribe( response=>{

          if (response){
            this.activateToast("Added to cart!", true);
          }else{
            this.activateToast("Failed to add to cart!", false);
          }
        });

        
      }else{
        if(this.itemCount > 0){
          this.activateToast("Unable to add to cart, You've selected too much", false)
        }else{
          this.activateToast("Please select more than 0", false)
        }
        
      }

      
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
  nextReviewPage(){
    if (this.userReviews().length > 0){
      this.reviewPageNo.update( value => value + 1);
      this.loadUserReviews();
    }
  }
  prevReviewPage(){
    if (this.reviewPageNo() > 0){
      this.reviewPageNo.update(value => value - 1);
      this.loadUserReviews();
    }
    
  }

  getPerPageCount(){ // experimentally found out

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
  @HostListener('window:resize', ['$event']) // repaginate whenever the site changes size
  onResize(event: Event) {
    
    this.loadSimilarProducts(this.getPerPageCount());
  }

  setByDate(bool: boolean){
    this.byDate = bool;
    this.loadUserReviews();
    
    if (bool){ // if by date 
      this.orderText = this.byDateText;
    }else{
      this.orderText = this.byRatingText;
    }

  }
  setByAscending(bool: boolean){
    this.byAscending = bool;
    this.loadUserReviews();

  }
  
  checkIfOrdered(){
    this.userService.checkPurchase(this.productId()).subscribe(response =>{
      if (response){
        
        this.purchased.set(true);
      }else{
        this.purchased.set(false);
      }
    });

  }
  
  

}