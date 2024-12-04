import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor-page',
  standalone: true,
  imports: [],
  templateUrl: './vendor-page.component.html',
  styleUrl: './vendor-page.component.css'
})
export class VendorPageComponent {

  route: ActivatedRoute = inject(ActivatedRoute);

  vendorId: number;

  constructor(){
    this.vendorId = Number(this.route.snapshot.params["id"]);
  }

}
