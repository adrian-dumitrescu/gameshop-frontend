import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/model/cart-item';
import { OrderDetails } from 'src/app/model/order-details';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { OrderDetailsService } from 'src/app/services/order-details.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public myShoppingCart!: ShoppingCart;
  public user!: User;
  public totalPrice: number = 0;
  public withGuard: boolean = false;
  public paymentOption: string = 'PayPal';
  public orderStatus!: string;
  // public orderStatus: string = "success";
  public imagePath: string = "../assets/game-icon-round/";

  constructor(private authService: AuthenticationService,
    private shoppingCartService: ShoppingCartService,
    private dataSharingService: DataSharingService,
    private orderDetailsService: OrderDetailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.subscriptions.push(
      this.dataSharingService.shoppingCart.subscribe(shoppingCart => {
        this.myShoppingCart = shoppingCart;
        if (this.myShoppingCart?.total != null) {
          if (this.withGuard) {
            this.totalPrice = shoppingCart.total + 2;
          } else {
            this.totalPrice = shoppingCart.total;
          }
        }
      })
    );
  }

  ngOnInit(): void {
    // if (this.activatedRoute != null) {
    //   this.orderStatusMessageParam();
    // }
    this.getAuthUser();
    this.setTotalWithoutGuardOption();
    // console.log(this.user);
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

  // public orderStatusMessageParam(): void {
  //   this.orderStatus = this.activatedRoute.snapshot.params['orderStatus'];
  // }

  public getDiscountedPrice(cartItem: CartItem): number {
    let discountedPrice = cartItem.product.pricePerKey - (cartItem.product.pricePerKey * cartItem.product.discountPercent / 100);
    return discountedPrice * cartItem.quantity;
  }

  public getShoppingCartSubtotal(): number {
    if (this.myShoppingCart?.total != null) {
      return this.myShoppingCart.total;
    }
    return 0;
  }
  public getShoppingCartTotal(): number {
    if (this.myShoppingCart?.total != null) {
      return this.totalPrice;
    }
    return 0;
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

  public setPaymentType(paymentOption: string) {
    this.paymentOption = paymentOption;
    console.log(paymentOption);
  }

  public onCreatePurchaseOrder(): void {
    const formData = new FormData;
    formData.append('clientEmail', this.user.email);
    formData.append('guardProtection', new Boolean(this.withGuard).toString());
    formData.append('paymentOption', this.paymentOption);

    if (this.user.shoppingCart.cartItems.length > 0) {
      // console.log(formData.get)
      this.subscriptions.push(
        this.orderDetailsService.createPurchaseOrder(formData).subscribe({
          next: (newOrder: OrderDetails) => {

            this.user.orderDetails.push(newOrder);
            this.user.shoppingCart = new ShoppingCart;
            this.authService.addUserToLocalCache(this.user);

            this.myShoppingCart = this.user.shoppingCart;
            this.dataSharingService.shoppingCart.next(this.myShoppingCart);

            this.orderStatus = 'success';
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.error.message);
            this.orderStatus = 'failed';
          }
        })
      );
    }
  }

  public onViewOrders(): void{
    this.router.navigate([`/orders`]);
  }
}
