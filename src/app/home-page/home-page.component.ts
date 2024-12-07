import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { ApiService } from '../services/api.service';
import { Category, ProductDTO } from '../models';
import { ProductCardComponent } from "../reusable/product-card/product-card.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{

  userDataService = inject(UserDataService);
  apiService = inject(ApiService);


  randomCategory = signal<Category | null>(null);

  
  randomList = signal<ProductDTO[]>([]);
  latestList = signal<ProductDTO[]>([]);
  personalizedList = signal<ProductDTO[]>([]);

  latestPageNo = signal(0);
  latestPerPage = signal(5);
  lastLatestPageNo = -1;

  randomPageNo = signal(0);
  randomPerPage = signal(5);
  lastRandomPageNo = -1;
  
  personalizedPageNo = signal(0);
  personalizedPerPage = signal(5);
  lastPersonalizedPageNo = -1;

  welcomeMessage = signal("Welcome ");
  
  ngOnInit(): void {
    
    if (this.userDataService.userEmail() != ""){ // user exists
      // do post login init
    }else{ // no user
      this.welcomeMessage.update(val => val + "!");

    }

    // random category selection
    this.apiService.getAllCategories().subscribe( catList =>{
      if (catList){
        this.randomCategory.set(
          catList[ Math.floor(Math.random() * catList.length)]
        );

        this.getLatestProducts(this.getPerPageCount());
        this.getRandomProducts(this.getPerPageCount());

      }else{
        console.error("No categories found!");
      }

    }
    );
    
  }


  getLatestProducts(perPage: number){
    if (perPage == this.latestList().length && // to prevent spamming the server, check product page.ts for more info
        this.latestPageNo() == this.lastLatestPageNo){
      return
    }

    this.apiService.getLatest(perPage,this.latestPageNo())
    .subscribe( list =>{
      if (list){
        this.latestList.set(list);
        this.lastLatestPageNo = this.latestPageNo();
      }else{
        this.latestList.set([]);
      }
    });
  }

  getRandomProducts(perPage: number){
    if (perPage == this.randomList().length && // to prevent spamming the server, check product page.ts for more info
        this.randomPageNo() == this.lastRandomPageNo){
      return
    }

    this.apiService.getLatestByCategory(this.randomCategory()?.name ?? "", perPage,this.randomPageNo())
    .subscribe( list =>{
      if (list){
        this.randomList.set(list);
        this.lastRandomPageNo = this.randomPageNo();
      }else{
        this.randomList.set([]);
      }
    });
  }
  getPersonalizedProducts(perPage: number){
    if (perPage == this.personalizedList().length && // to prevent spamming the server, check product page.ts for more info
        this.personalizedPageNo() == this.lastPersonalizedPageNo){
      return
    }

    // TODO -> once log in, carts, orders are set up, 
    // find most purchased vendor and show latest products or most purchased category

    this.apiService.getLatestByVendor("" , perPage,this.personalizedPageNo())
    .subscribe( list =>{
      if (list){
        this.personalizedList.set(list);
        this.lastPersonalizedPageNo = this.personalizedPageNo();
      }else{
        this.personalizedList.set([]);
      }
    });
    
  }

  nextPersonalizedPage(){
    if (this.personalizedList().length > 0){
      this.personalizedPageNo.update( value => value + 1);
      this.getPersonalizedProducts(this.getPerPageCount());
    }
  }

  prevPersonalizedPage(){
    if (this.personalizedPageNo() > 0){
      this.personalizedPageNo.update(value => value - 1);
      this.getRandomProducts(this.getPerPageCount());
    }
  }


  
  nextRandomPage(){
    if (this.randomList().length > 0){
      this.randomPageNo.update( value => value + 1);
      this.getRandomProducts(this.getPerPageCount());
    }
  }

  prevRandomPage(){
    if (this.randomPageNo() > 0){
      this.randomPageNo.update(value => value - 1);
      this.getRandomProducts(this.getPerPageCount());
    }
  }


  nextLatestPage(){
    if (this.latestList().length > 0){
      this.latestPageNo.update( value => value + 1);
      this.getLatestProducts(this.getPerPageCount());
    }
  }

  prevLatestPage(){
    if (this.latestPageNo() > 0){
      this.latestPageNo.update(value => value - 1);
      this.getLatestProducts(this.getPerPageCount());
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
    this.getLatestProducts(this.getPerPageCount());
    this.getRandomProducts(this.getPerPageCount());
  }



}
