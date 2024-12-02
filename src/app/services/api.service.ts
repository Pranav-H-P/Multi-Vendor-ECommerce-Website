import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }


  dummyCartList = [
    ["item1" , 100, 1],
    ["dumbell", 400, 4],
    ["item3", 50, 4]
  ];
  dummyItemList = ["item1", "testing", "item2", "barbell", "dumbell", "item3"];

  setJWT(token: string){
    localStorage.setItem('jwt', token);
  }
  getJWT(){
    const jwt = localStorage.getItem('jwt'); // stored just as a string
  }

  getNSearchResults(itemName: string, n: number){
    const matchingItems = this.dummyItemList.filter(item => 
      item.toLowerCase().includes(itemName)
    )
    return matchingItems.slice(0, n);
  }

  getSearchPreview(itemName: string){

    const lowerCaseItem = itemName.toLowerCase()
    return this.getNSearchResults(lowerCaseItem, 5);

  }

  getCart(){
    return this.dummyCartList;
  }

}
