import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserDataService } from '../services/user-data.service';
import { ToastComponent } from '../reusable/toast/toast.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ToastComponent, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {


  apiService = inject(ApiService);
  router = inject(Router);
  userDataService = inject(UserDataService);


  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);

  selectedFile: File | null = null;
  newAddress = "";


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadProfilePic()
  }


  uploadProfilePic(){

    this.userDataService.uploadProfilePicture(this.selectedFile).subscribe(response =>{
      if (response){
        
        this.activateToast("Profile Photo Updated Successfully! Refresh to view changes", true);

      }else{
        this.activateToast("Updation Failed!", false);
      }
    });
  }

  updateAddress(){
    this.userDataService.updateAddress(this.newAddress).subscribe(response =>{
      if (response){
        
        this.userDataService.refreshUserData();

        this.activateToast("Address Updated Successfully!", true);
      }else{
        this.activateToast("Updation Failed!", false);
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
