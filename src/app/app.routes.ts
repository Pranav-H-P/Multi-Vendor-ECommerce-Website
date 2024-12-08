import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { WishlistPageComponent } from './wishlist-page/wishlist-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { VendorPageComponent } from './vendor-page/vendor-page.component';
import { SupportPageComponent } from './support-page/support-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';
import { noLoginGuard } from './guards/no-login.guard';
import { vendorGuard } from './guards/vendor.guard';
import { homepageGuard } from './guards/homepage.guard';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';

export const routes: Routes = [
    {
        path: "",
        component: HomePageComponent,
        canActivate: [homepageGuard]
    },
    {
        path: "home",
        component: HomePageComponent,
        canActivate: [homepageGuard]
    },
    {
        path: "login",
        component: LoginPageComponent,
        canActivate: [noLoginGuard]
    },
    {
        path: "login/expired",
        component: LoginPageComponent,
        canActivate: [noLoginGuard]
    },
    {
        path: "cart",
        component: CartPageComponent,
        canActivate: [loginGuard]
    },
    {
        path: "order",
        component: OrderPageComponent,
        canActivate: [loginGuard]
    },
    {
        path: "wishlist",
        component: WishlistPageComponent,
        canActivate: [loginGuard]
    },
    {
        path: "product/:id",
        component: ProductPageComponent
    },
    {
        path: "vendorpage/:id",
        component: VendorPageComponent
    },
    {
        path: "support",
        component: SupportPageComponent,
        canActivate: [loginGuard]
    },
    {
        path: "register/customer",
        component: RegisterPageComponent,
        canActivate: [noLoginGuard]
    },
    {
        path: "register/vendor",
        component: RegisterPageComponent,
        canActivate: [noLoginGuard]
    },
    {
        path: "search/:term",
        component: SearchPageComponent
    },
    {
        path: "admin/dashboard",
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
    },
    {
        path: "vendor/dashboard",
        component: VendorDashboardComponent,
        canActivate: [vendorGuard]
    },
    {
        path: "profile",
        component: ProfilePageComponent
    },
    {
        path: "payment",
        component: PaymentGatewayComponent,
        canActivate: [loginGuard]

    },
    {
        path: "**",
        component: NotFoundComponent
    }

];
