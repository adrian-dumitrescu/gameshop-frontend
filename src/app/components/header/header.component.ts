import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type';
import { Role } from 'src/app/enum/role';
import { CustomHttpResponse } from 'src/app/interfaces/custom-http-response';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/product';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { UserService } from 'src/app/services/user.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  // private subscription!: Subscription;
  // private subscription2!: Subscription;
  public user!: User;
  public guestUser!: User;
  public isAuthenticated!: boolean;
  public openSearchBar: boolean = false;
  public headerSignInForm!: FormGroup;
  public myShoppingCart!: ShoppingCart;
  public userRole!: string;
  public imagePath: string = "../assets/game-icon-round/";

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private dataSharingService: DataSharingService,
    private shoppingCartService: ShoppingCartService) {
    this.subscriptions.push(
      this.dataSharingService.shoppingCart.subscribe(shoppingCart => {
        this.myShoppingCart = shoppingCart;
      })
    );
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

  }

  ngOnInit(): void {
    this.getAuthUser();
    this.roleToString();
    //alert(this.userIsAuthenticated);
    this.subscriptions.push(
      this.authService.getIsAuthenticated().subscribe((isAuthenticated: boolean) => {
        this.user = this.authService.getUserFromLocalCache();
        this.isAuthenticated = isAuthenticated;
      })
    );

    // this.headerSignInForm = this.formBuilder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required]
    // })

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
      this.myShoppingCart = this.user.shoppingCart;
    }
    // else {
    //   if (this.authService.getGuestFromLocalCache() == undefined) {
    //     this.authService.addGuestToLocalCache(this.guestUser);
    //   }
    // }
  }

  private roleToString(): string {
    if (this.isAdmin) {
      return this.userRole = "Admin";
    }
    else {
      return this.userRole = "User";
    }
  }

  private getUserRole(): string {
    return this.authService.getUserFromLocalCache().roles[0].role;
    //return this.user.roles[0].role;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isUser(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }


  public logOut(): void {
    this.authService.logOut();
    this.router.navigate([`/sign-in`]);
    this.notificationService.notify(NotificationType.SUCCESS, `You've been successfully logged out`);
  }


  goToMainPage() {
    this.router.navigate([`/main`]);
  }

  openSearch() {
    this.openSearchBar = !this.openSearchBar;
  }

  public showFullNameOrNickname(): string {
    if (this.user.nickname == null || '') {
      return this.user.firstName + " " + this.user.lastName;
    } else {
      return this.user.nickname;
    }
  }

  public showNameOrNickname(): string {
    if (this.user.nickname == null || '') {
      return this.user.firstName;
    } else {
      return this.user.nickname;
    }
  }

  public getCartItems(): CartItem[] | undefined {
    if (this.user.shoppingCart?.cartItems != null) {
      return this.user.shoppingCart.cartItems;
    }
    return undefined;
  }


  // this.userService.resetPassword(emailAddress).subscribe(
  //   (response: CustomHttpRespone) => {
  //     this.sendNotification(NotificationType.SUCCESS, response.message);
  //     this.refreshing = false;
  //   },
  //   (error: HttpErrorResponse) => {
  //     this.sendNotification(NotificationType.WARNING, error.error.message);
  //     this.refreshing = false;
  //   },
  //   () => emailForm.reset()

  public deleteItemFromShoppingCart(cartItemId: number) {
    this.subscriptions.push(
      this.shoppingCartService.deleteItemFromShoppingCartById(cartItemId).subscribe({
        next: (newShoppingCart: ShoppingCart) => {
          console.log(newShoppingCart.id);
          // let newCartItems = this.shoppingCart.cartItems.filter(cartItem => cartItem.id !== cartItemId);
          // this.shoppingCart.cartItems = newCartItems;

          this.myShoppingCart = newShoppingCart;
          this.dataSharingService.shoppingCart.next(this.myShoppingCart);

          this.user.shoppingCart = newShoppingCart;
          this.authService.addUserToLocalCache(this.user);

        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public getShoppingCartTotal(): number {
    if (this.myShoppingCart?.total != null) {
      return this.myShoppingCart.total;
    }
    return 0;
  }

  public getDiscountedPrice(product: Product): number {
    let discountedPrice = product.pricePerKey - (product.pricePerKey * product.discountPercent / 100);
    return discountedPrice;
  }

  public isDiscountApplied(product: Product): boolean {
    if (product.discountPercent != 0) {
      return true;
    } else {
      return false;
    }
  }


  // headerSignIn(){
  //   this.userService.login(this.headerSignInForm.value.email, this.headerSignInForm.value.password).subscribe({
  //     next: (response: User) => { this.user = response, this.signIn.goToMainPage()}, // completeHandler
  //     error: (error: HttpErrorResponse) => { alert(error.message) }
  //   });
  // }

}
