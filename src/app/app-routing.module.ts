import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { HeaderComponent } from './components/header/header.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { UserComponent } from './components/user/user.component';
import { ModalComponent } from './components/modal/modal.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserInventoryComponent } from './components/user-inventory/user-inventory.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'}, // set default path
  {path:'main',component:MainComponent},
  {path:'sign-up',component:SignUpComponent},
  {path:'sign-in',component:SignInComponent},
  {path:'sign-in/:registrationSuccess',component:SignInComponent},
  // {path:'product-view', component:ProductViewComponent},
  {path:'product-view/:productId', component:ProductViewComponent},
  {path:'profile',component:UserProfileComponent, canActivate: [AuthenticationGuard]},
  // {path:'profile/:profileImage',component:UserProfileComponent, canActivate: [AuthenticationGuard]},
  {path:'settings',component:UserSettingsComponent, canActivate: [AuthenticationGuard]},
  {path:'orders',component:UserOrdersComponent, canActivate: [AuthenticationGuard]},
  {path:'inventory',component:UserInventoryComponent, canActivate: [AuthenticationGuard]},
  {path:'inventory/:keySubmitSuccess',component:UserInventoryComponent, canActivate: [AuthenticationGuard]},
  {path:'cart',component:ShoppingCartComponent, canActivate: [AuthenticationGuard]},
  {path:'checkout',component:CheckoutComponent, canActivate: [AuthenticationGuard]},
  {path:'search-bar',component:SearchBarComponent},
  {path:'contact-us', component:ContactUsComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
