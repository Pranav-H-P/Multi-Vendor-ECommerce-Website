import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastComponent } from "../reusable/toast/toast.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { Category, ProductType } from '../models';

@Component({
  selector: 'app-vendor-create-product',
  standalone: true,
  imports: [ToastComponent, FormsModule],
  templateUrl: './vendor-create-product.component.html',
  styleUrl: './vendor-create-product.component.css'
})
export class VendorCreateProductComponent implements OnInit{

  router = inject(Router);
  route = inject(ActivatedRoute);
  userDataService = inject(UserDataService);
  apiService = inject(ApiService);
  

  categoryList = signal<Category[]>([]);

  selectedFiles: File[] | null = null;

  toastDuration = 3000;
  toastVisible = signal(false);
  toastMessage = signal("Testing");
  toastSuccess = signal(true);

  productId = signal(-1);


  pName = "";
  description = "";
  price = 0;
  categoryId = 0;
  stock = 0;
  sales = 0;


  ngOnInit(): void {

    if (!this.router.url.endsWith("addnew")){

      this.route.params.subscribe(params => {
        this.productId.set(params['id']);

        this.apiService.getAllCategories().subscribe(cat=>{
          if (cat){
            this.categoryList.set(cat);
          }else{
            this.categoryList.set([]);
          }
        });

      });
    }else{
      this.activateToast("images can only be added during modification", true);
    }

      
  }


  onFileChange(event: any){
    this.selectedFiles = event.target.files;
  }


  uploadImages(){

    if (this.selectedFiles && this.productId() != -1) {
      
      this.userDataService.uploadProductPictures(this.selectedFiles, this.productId()).subscribe(response=>{
        if (response){
          this.activateToast("Successfully uploaded images!", true);

          setTimeout(() => {
            this.router.navigate(['/vendor/dashboard'])
            }, this.toastDuration);

          
        }else{
          this.activateToast("images could not be uploaded!", false);
        }
      })

      



    }else{
      
    setTimeout(() => {
      this.router.navigate(['/vendor/dashboard'])
      }, this.toastDuration);
    }
    
    
  }



  submit(){


    if (this.pName.trim() == ""){
      this.activateToast("Details cant be blank!", false);

      return;
    }
    if (this.price <0 || this.stock < 0){
      this.activateToast("Numbers cant be negative!", false);
      return;
    }

    let prod: ProductType = {

      vendorId: this.userDataService.userProfile().id,
      name: this.pName,
      description: this.description,
      price: this.price,
      categoryId: this.categoryId,
      createdDate: new Date(),
      stock:this.stock,
      sales: this.sales

    }

    if (this.productId() != -1){
      prod.id = this.productId()
    }


    this.userDataService.saveProduct(prod).subscribe(p=>{
      if (p){
        this.activateToast("Successfully created/modified product!", true);

        // uploading images seperately
        this.uploadImages()
        
        
      }else{
        this.activateToast("failed to create/modify product!", false);
      }
    })

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
