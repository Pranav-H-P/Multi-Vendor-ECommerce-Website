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
  
  constructor(){

  }
}
