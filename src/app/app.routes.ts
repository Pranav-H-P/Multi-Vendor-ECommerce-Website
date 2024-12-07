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

export const routes: Routes = [
    {
        path: "",
        component: HomePageComponent
    },
    {
        path: "home",
        component: HomePageComponent
    },
    {
        path: "login",
        component: LoginPageComponent
    },
    {
        path: "login/expired",
        component: LoginPageComponent
    },
    {
        path: "cart",
        component: CartPageComponent
    },
    {
        path: "order",
        component: OrderPageComponent
    },
    {
        path: "wishlist",
        component: WishlistPageComponent
    },
    {
        path: "product/:id",
        component: ProductPageComponent
    },
    {
        path: "vendor/:id",
        component: VendorPageComponent
    },
    {
        path: "support",
        component: SupportPageComponent
    },{
        path: "search/:term",
        component: SearchPageComponent
    },
    {
        path: "**",
        component: NotFoundComponent
    }

];
