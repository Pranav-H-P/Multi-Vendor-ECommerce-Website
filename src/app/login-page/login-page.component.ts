import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastComponent } from "../reusable/toast/toast.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ToastComponent, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{


  router: Router = inject(Router);
  userDataService = inject(UserDataService);


  email: string = "";
  password: string = "";

  passwordVisible = false;


  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);



  ngOnInit(): void {
    if (this.router.url.endsWith("expired")){
      this.activateToast("Token Expired!!\nPlease log in again!", false);
    }
  }

  login(){

    if (this.email.trim() === "" || this.password.trim() === ""){
      this.activateToast("Fields cannot be blank!" ,false);
      return;
    }

    this.userDataService.login(this.email,this.password).subscribe(response =>{
      if (response){
        if (response.err == null){
          this.userDataService.setJwt(response.jwt);
          this.userDataService.getUserData().subscribe(data=>{
            if (data){
              this.userDataService.userProfile.set(data);

              this.router.navigate(['/home']);

            }else{
              console.error("User not Found!"); // i dont think this is ever possible
            }
          });

        }else{
          this.activateToast("Login Failed! Check your credentials", false);
        }
      }else{
        this.activateToast("Login Failed! Check your credentials", false);
      }
    });

  }


  togglePasswordVisible(){
    this.passwordVisible = !this.passwordVisible;
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
