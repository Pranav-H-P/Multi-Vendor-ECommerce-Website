import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataService } from '../services/user-data.service';
import { Vendor } from '../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{


  userDataService = inject(UserDataService);


  pendingVendorList = signal<Vendor[]>([]);

  ngOnInit(): void {
    this.loadVendorList();
  }

  loadVendorList(){
    this.userDataService.getPendingVendors().subscribe(vendors =>{
      if (vendors){
        this.pendingVendorList.set(vendors);
      }else{
        this.pendingVendorList.set([]);
      }
    }
    );
  }


  approve(vendor: Vendor){

    this.userDataService.approveVendor(vendor).subscribe(resp=>{
      if (resp){
        this.loadVendorList();
      }
    });

  }

  reject(vendor: Vendor){
    this.userDataService.rejectVendor(vendor).subscribe(resp=>{
      if (resp){
        this.loadVendorList();
      }
    });
  }

}
