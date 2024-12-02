import { Injectable, signal } from '@angular/core';
import { CartType, ProductType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }


  dummyCartList = signal<CartType[]>([
    {userId:1231231,
      productId: 412341,
      productName: "dummy",
      quantity: 2,
      price: 100,
      dateAdded: new Date()
    },
    {userId:1231231,
      productId: 412341,
      productName: "dummy",
      quantity: 2,
      price: 100,
      dateAdded: new Date()
    },
    {userId:1231231,
      productId: 412341,
      productName: "dummy",
      quantity: 2,
      price: 100,
      dateAdded: new Date()
    }
  ]);

  dummyItemList = signal<ProductType[]>([
    {
      productName:"testing",
      productId: 12316623
    },
    {
      productName:"testing2",
      productId: 12312543
    },
    {
      productName:"testing3",
      productId: 12311323
    },
    {
      productName:"testing4",
      productId: 12312743
    },
  ]);

  setJWT(token: string){
    localStorage.setItem('jwt', token);
  }
  getJWT(){
    const jwt = localStorage.getItem('jwt'); // stored just as a string
  }

  getNSearchResults(itemName: string, n: number){
    const matchingItems = this.dummyItemList().filter(item => 
      item.productName.toLowerCase().includes(itemName)
    )
    return matchingItems.slice(0, n);
  }

  getSearchPreview(itemName: string){

    const lowerCaseItem = itemName.toLowerCase()
    return this.getNSearchResults(lowerCaseItem, 5);

  }

  getCartPreview(){
    return this.dummyCartList;
  }

}
