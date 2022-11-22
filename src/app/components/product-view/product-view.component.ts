import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductDetails } from 'src/app/model/product-details';
import { ShoppingCart } from 'src/app/model/shopping-cart';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ProductDetailsService } from 'src/app/services/product-details.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public allProducts!: Product[];
  public user!: User;
  public myShoppingCart!: ShoppingCart;
  public displayedProductId!: number;
  public productDetails!: ProductDetails;
  public imagePath: string = "../assets/game-card/";
  public userRating: number = 100;
  public ratingValue: string = this.userRating + "%";
  public filterOption: string = "product"
  public cheapestProduct!: Product;

  constructor(private productDetailsService: ProductDetailsService,
    private authService: AuthenticationService,
    private dataSharingService: DataSharingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService) { }



  ngOnInit(): void {
    if (this.activatedRoute != null) {
      this.productTitleMessageParam();
      this.getProductDetailsById(this.displayedProductId);
    } else {
      this.router.navigate(['/main']);
    }
    this.getAuthUser();
    this.getAllProducts();
    // this.getFirstProductFromList();

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


  public getProductDetailsTitle(): string {
    if (this.productDetails?.title != null) {
      return this.productDetails.title;
    }
    return "";
  }

  public productTitleMessageParam(): void {
    this.displayedProductId = this.activatedRoute.snapshot.params['productId'];
  }

  public getProductDetailsById(productId: number) {
    // let params = new HttpParams().set('productId', productId);

    this.subscriptions.push(
      this.productDetailsService.getProductDetailsById(productId).subscribe({
        next: (productDetails: ProductDetails) => {
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

  public getAllProducts() {
    this.subscriptions.push(
      this.productService.getAllProducts().subscribe({
        next: (products: Product[]) => {
          this.allProducts = products;

        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public isDiscountApplied(product: Product): boolean {
    if (product?.discountPercent != 0) {
      return true;
    } else {
      return false;
    }
  }

  public getDiscountedPrice(product: Product): number {
    let discountedPrice = product?.pricePerKey - (product?.pricePerKey * product?.discountPercent / 100);
    return discountedPrice;
  }

  // get getDiscountedPrice2(product: Product): number {
  //   let discountedPrice = product?.pricePerKey - (product?.pricePerKey * product?.discountPercent / 100);
  //   return discountedPrice;
  // }
  public getFirstProductFromList(): Product {
    // transform(products: Product[], searchInput: string, filterOption: string): Product[] | null{

      let productsArray = this.allProducts?.filter(product => product?.productDetails.title.toLocaleLowerCase().includes(this.getProductDetailsTitle().toLocaleLowerCase()));
      let sortedArray = productsArray?.sort((a, b) => (this.getDiscountedPrice(a) < this.getDiscountedPrice(b)) ? -1 : 1).reverse();
      let cheapestProduct = sortedArray?.pop();
      
      // console.log(cheapestProduct)
      if (cheapestProduct != null) {
        this.cheapestProduct = cheapestProduct;
        // console.log(this.cheapestProduct)
        return cheapestProduct;

      }
    

    return new Product;
  }
}
