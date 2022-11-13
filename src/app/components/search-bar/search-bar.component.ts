import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductDetails } from 'src/app/model/product-details';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductDetailsService } from 'src/app/services/product-details.service';
import { ProductService } from 'src/app/services/product.service';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { CartItem } from 'src/app/model/cart-item';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public productDetails!: ProductDetails[];
  public guestShoppingCart!: ShoppingCart;
  public user!: User;
  public guestUser!: User | undefined;
  public allProducts!: Product[];
  public imagePath_76x76: string = "../assets/game-icon_76x76/";
  public userRating: number = 100;
  public ratingValue: string = this.userRating + "%";
  public searchInput!: string;

  public activeProduct: string = "active"
  public activeNickname: string = ""
  public filterOption: string = "product"

  constructor(private productDetailsService: ProductDetailsService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private dataSharingService:DataSharingService) { }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.getAuthUser();
    this.getAllProducts();
    this.getAllProductDetails();
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    } 
    // else {
    //   this.guestUser = this.authService.getGuestFromLocalCache();
    // }
  }

  public getAllProducts() {
    this.subscriptions.push(
      this.productService.getAllProducts().subscribe({
        next: (products: Product[]) => {
          this.allProducts = products;
          // products.forEach(product => {
          //   console.log(product.id);
          //   console.log(product.productDetails.title);
          // })

        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public getAllProductDetails() {
    this.subscriptions.push(
      this.productDetailsService.getAllProductDetails().subscribe({
        next: (productDetails: ProductDetails[]) => {
          this.productDetails = productDetails;
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public addItemToShoppingCart(productTitle: string, sellerEmail: string) {
    if (this.authService.isUserLoggedIn()) {
      const formData = new FormData;
      formData.append('clientEmail', this.user.email);
      formData.append('sellerEmail', sellerEmail);
      formData.append('productTitle', productTitle);

      this.subscriptions.push(
        this.shoppingCartService.addItemToShoppingCart(formData).subscribe({
          next: (shoppingCart: ShoppingCart) => {
            this.dataSharingService.shoppingCart.next(shoppingCart);
            this.user.shoppingCart = shoppingCart;
            this.authService.addUserToLocalCache(this.user);
            // this.router.navigate(['/search-bar']).then(() => {
            //   window.location.reload();
            // });
          },
          error: (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse.error.message);
          }
        })
      );
    } else {
      //this.authService.getGuestFromLocalCache();
      // Make here a subscribe which creates a guest shopping cart with no connection to a user
      //this.guestShoppingCart.cartItems.push()
      this.router.navigate(['/sign-in']);
    }
  }



  public isDiscountApplied(product: Product): boolean {
    if (product.discountPercent != 0) {
      return true;
    } else {
      return false;
    }
  }

  public getDiscountedPrice(product: Product): number {
    let discountedPrice = product.pricePerKey - (product.pricePerKey * product.discountPercent / 100);
    return discountedPrice;
  }

  public filterByProduct() {
    this.activeProduct = "active";
    this.activeNickname = "";
    this.filterOption = "product"
  }

  public filterByNickname() {
    this.activeProduct = "";
    this.activeNickname = "active";
    this.filterOption = "nickname"
  }




}

