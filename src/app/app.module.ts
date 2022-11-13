import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ModalComponent } from './components/modal/modal.component';
import { MainComponent } from './components/main/main.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './services/notification.service';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { UserInventoryComponent } from './components/user-inventory/user-inventory.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    FooterComponent,
    HeaderComponent,
    SignUpComponent,
    SignInComponent,
    ModalComponent,
    MainComponent,
    SearchBarComponent,
    UserSettingsComponent,
    UserProfileComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    UserInventoryComponent,
    UserCardComponent,
    SearchFilterPipe,
    ContactUsComponent
  ],
  imports: [
    NotificationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    GoogleMapsModule
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }], 
    bootstrap: [AppComponent]
})
export class AppModule { }
