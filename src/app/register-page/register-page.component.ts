import { Component, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { ToastComponent } from "../reusable/toast/toast.component";
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { FormsModule } from '@angular/forms';
import { UserRole } from '../enums';
import { RegisterDTO } from '../models';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ToastComponent, FormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit{
  
  router: Router = inject(Router);
  userDataService = inject(UserDataService);
  route = inject(ActivatedRoute);

  email: string = "";
  name: string = "";
  password: string = "";
  passwordRepeat: string = "";
  phoneNumber: string = "";
  address: string = "";
  
  registerMessage = "Register";

  passwordVisible = false;

  userType: UserRole = UserRole.CUSTOMER;

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      
      if (this.router.url.endsWith("vendor")){
        this.registerMessage = "Vendor Registration";
        this.userType = UserRole.VENDOR;

      }else{
        this.registerMessage = "Register";
        this.userType = UserRole.CUSTOMER;
      }
      
      
    });
    
  }

  
  validNumber(st: string){
    st = st.trim()
    const number = parseFloat(st);
    
    return !isNaN(number) && isFinite(number) && number >= 0;
  }

  validateFields(){

    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (this.name.trim() === "" ||
      this.password.trim() === "" ||
      this.passwordRepeat.trim() === "" ||
      this.email.trim() === "" ||
      this.phoneNumber.trim() === "" ||
      this.address.trim() === ""){
          
      this.activateToast("Fields cannot be left blank!", false);
      return;
    
    }
    
    if (this.password.length < 8){
      this.activateToast("Passwords have to be 8 characters or longer!", false);
      return;
    }

    if (this.password !== this.passwordRepeat){
      
      this.activateToast("Passwords have to match!", false);
      return;
    }
    
    if (!this.validNumber(this.phoneNumber) ||
    this.phoneNumber.trim().length !== 10){
      this.activateToast("Invalid phone number!", false);
      return;
    }

    if (!emailRegex.test(this.email)){
      this.activateToast("Invalid email!", false);
      return;
    }

    let registerRequest: RegisterDTO = {
      name: this.name,
      password: this.password,
      email: this.email,
      phoneNumber: parseInt(this.phoneNumber),
      role: this.userType,
      address: this.address
    }

    return registerRequest;

  }


  register(){

    const validatedData = this.validateFields();
    if (validatedData === undefined){  
      return;
    }
    
    this.userDataService.register(validatedData).subscribe(response =>{
      if (response){
        if (response.err == null){
          
          this.userDataService.setJwt(response.jwt);
          
          this.userDataService.getUserData().subscribe(data=>{
            
            if (data){
              this.userDataService.userProfile.set(data);

              this.router.navigate(['/home']);

            }else{
              console.error("User not Found!"); 
            }
          });

        }else{
          this.activateToast(response.err, false);
        }
      }else{
        this.activateToast("Login Failed! Email already exists", false);
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
