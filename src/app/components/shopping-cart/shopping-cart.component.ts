import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/product';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public user!: User;
  public myShoppingCart!: ShoppingCart;
  public guestUser!: User;
  public imagePath: string = "../assets/game-icon-round/";
  public totalPrice: number = 0;
  public withGuard: boolean = false;
  public userRating: number = 100;
  public ratingValue: string = this.userRating + "%";

  constructor(private authService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private dataSharingService: DataSharingService) {
    this.subscriptions.push(
      this.dataSharingService.shoppingCart.subscribe(shoppingCart => {
        this.myShoppingCart = shoppingCart;
      })
    );
  }


  ngOnInit(): void {
    this.getAuthUser();
    this.setTotalWithoutGuardOption();
    // else {
    //   this.guestUser = this.authService.getUserFromLocalCache();
    // }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
      this.myShoppingCart = this.user.shoppingCart;
    }
  }

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

          if(this.withGuard){
            this.totalPrice = newShoppingCart.total + 2;
          }else{
            this.totalPrice = newShoppingCart.total;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public getShoppingCartSubtotal(): number {
    if (this.myShoppingCart?.total != null) {
      return this.myShoppingCart.total;
    }
    return 0;
  }

  public getDiscountedPrice(cartItem: CartItem): number {
    let discountedPrice = cartItem.product.pricePerKey - (cartItem.product.pricePerKey * cartItem.product.discountPercent / 100);
    return discountedPrice * cartItem.quantity;
  }

  public getFullPrice(cartItem: CartItem): number {
    return cartItem.product.pricePerKey * cartItem.quantity;
  }

  public isDiscountApplied(product: Product): boolean {
    if (product.discountPercent != 0) {
      return true;
    } else {
      return false;
    }
  }

  public setTotalWithoutGuardOption() {
    this.totalPrice = this.myShoppingCart?.total;
    this.withGuard = false;
    //return this.totalPrice;
  }

  public setTotalWithGuardOption() {
    this.totalPrice = this.myShoppingCart?.total + 2;
    this.withGuard = true;
    //return this.totalPrice;
  }

  public onPlusClick(cartItemId: number){
    let params = new HttpParams().set('cartItemId', cartItemId);

    this.subscriptions.push(
      this.shoppingCartService.incrementItemQuantity(params).subscribe({
        next: (newShoppingCart: ShoppingCart) => {
          // console.log(newShoppingCart.id);
          // let newCartItems = this.shoppingCart.cartItems.filter(cartItem => cartItem.id !== cartItemId);
          // this.shoppingCart.cartItems = newCartItems;
          this.myShoppingCart = newShoppingCart;
          this.dataSharingService.shoppingCart.next(this.myShoppingCart);

          this.user.shoppingCart = newShoppingCart;
          this.authService.addUserToLocalCache(this.user);

          if(this.withGuard){
            this.totalPrice = newShoppingCart.total + 2;
          }else{
            this.totalPrice = newShoppingCart.total;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public onMinusClick(cartItemId: number){
    let params = new HttpParams().set('cartItemId', cartItemId);
    
    this.subscriptions.push(
      this.shoppingCartService.decrementItemQuantity(params).subscribe({
        next: (newShoppingCart: ShoppingCart) => {
          console.log(newShoppingCart.id);
          // let newCartItems = this.shoppingCart.cartItems.filter(cartItem => cartItem.id !== cartItemId);
          // this.shoppingCart.cartItems = newCartItems;
          this.myShoppingCart = newShoppingCart;
          this.dataSharingService.shoppingCart.next(this.myShoppingCart);

          this.user.shoppingCart = newShoppingCart;
          this.authService.addUserToLocalCache(this.user);

          if(this.withGuard){
            this.totalPrice = newShoppingCart.total + 2;
          }else{
            this.totalPrice = newShoppingCart.total;
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

}
