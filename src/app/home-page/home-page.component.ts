import { Component, inject } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  userDataService = inject(UserDataService);
  apiService = inject(ApiService);
  
}
