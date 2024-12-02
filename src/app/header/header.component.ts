import { Component, Inject } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  userData = Inject(UserDataService);

  expandProfile: boolean = false;
  expandCart: boolean = false;

  constructor(){

  }

  toggleCart(event: MouseEvent){
    event.stopPropagation();
    console.log("clicked")
    this.expandCart = !this.expandCart;
    this.expandProfile = false;
  }
  toggleProfile(event: MouseEvent){
    event.stopPropagation();
    console.log("clicked")
    this.expandProfile = !this.expandProfile;
    this.expandCart = false;
  }
  closePopUps(){
    console.log("close clicked")
    this.expandCart = false;
    this.expandProfile = false;
    
  }


}
