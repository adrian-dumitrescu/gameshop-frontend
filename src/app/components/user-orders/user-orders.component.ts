import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/model/cart-item';
import { OrderDetails } from 'src/app/model/order-details';
import { OrderItem } from 'src/app/model/order-item';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OrderDetailsService } from 'src/app/services/order-details.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public imagePath: string = "../assets/game-icon-round/";
  public user!: User;
  public openOrderView: boolean = false;
  public selectedOrder!: number;
  

  constructor(private authService: AuthenticationService,
    private orderDetailsService: OrderDetailsService) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.getAuthUser();
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
  }

  public showOrderDetails(orderId: number) {
    this.selectedOrder = orderId;
    this.openOrderView = !this.openOrderView;
  }

  public getDiscountedPrice(cartItem: OrderItem): number {
    let discountedPrice = cartItem.product.pricePerKey - (cartItem.product.pricePerKey * cartItem.product.discountPercent / 100);
    return discountedPrice * cartItem.quantity;
  }
  

  

  // public getOrderDetailsForUser(): void {
  //   let params = new HttpParams().set('userEmail', this.user.email);
    
  //   if (this.user.shoppingCart.cartItems.length > 0) {
  //     // console.log(formData.get)
  //     this.subscriptions.push(
  //       this.orderDetailsService.getAllOrderDetails(params).subscribe({
  //         next: (orderDetails: OrderDetails[]) => {
  //           this.user.orderDetails = orderDetails;
  //           this.authService.addUserToLocalCache(this.user);
  //         },
  //         error: (errorResponse: HttpErrorResponse) => {
  //           console.log(errorResponse.error.message);
  //         }
  //       })
  //     );
  //   }
  // }

}
