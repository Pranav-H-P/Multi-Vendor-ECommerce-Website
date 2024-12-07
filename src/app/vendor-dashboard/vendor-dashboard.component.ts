import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Vendor } from '../models';
import { UserDataService } from '../services/user-data.service';
import { ToastComponent } from "../reusable/toast/toast.component";
import { VendorApprovalStatus } from '../enums';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [ToastComponent],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.css'
})
export class VendorDashboardComponent implements OnInit{


  apiService = inject(ApiService);
  userDataService = inject(UserDataService);

  vendorProfileData = signal<Vendor>({
    name: "",
    approvalStatus: VendorApprovalStatus.PENDING,
    id: -1,
    joinDate: new Date(),
    description: "",
    contactDetails: ""
  });
  

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);


  ngOnInit(): void {
    
    this.apiService.getVendorDetails(this.userDataService.userProfile().id)
    .subscribe(vend =>{
      if (vend){
        this.vendorProfileData.set(vend);
      }
    });

  }

  activateToast(msg: string, status: boolean){
    this.toastVisible.set(true);
    this.toastMessage.set(msg);
    this.toastSuccess.set(status);
    
    setTimeout(() => {
      this.toastVisible.set(false);
      }, this.toastDuration);
  }


}
