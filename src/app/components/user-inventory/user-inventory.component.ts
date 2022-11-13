import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { findIndex, Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductDetails } from 'src/app/model/product-details';
import { ProductKey } from 'src/app/model/product-key';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ProductDetailsService } from 'src/app/services/product-details.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-user-inventory',
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss']
})
export class UserInventoryComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public productDetails!: ProductDetails[];
  public openNewKeyForm: boolean = false;
  public openProductEdit: boolean = false;
  public editProduct!: string;
  public keySubmitSuccess!: string;
  public addNewKeyForm!: FormGroup;
  public updateProductPriceFrom!: FormGroup;
  public user!: User;
  public myProducts!: Product[];
  public productKeys!: ProductKey[];
  public imagePath: string = "../assets/game-icon-round/";
  discountApplied: boolean = true;

  constructor(private productDetailsService: ProductDetailsService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataSharingService: DataSharingService) {
      this.subscriptions.push(
        this.dataSharingService.products.subscribe(products => {
          this.myProducts = products;
        })
      );
     }

  ngOnInit(): void {
    if (this.activatedRoute != null) {
      this.keySubmitSuccessMessageParam();
    }
    this.getAuthUser();
    this.getAllProductDetails();
    this.getAddNewKeyFrom();
    this.getUpdateProductPriceFrom();

    //this.getUserProductsFromCache();
    // to be edited:
    this.getUserProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public keySubmitSuccessMessageParam(): void {
    this.keySubmitSuccess = this.activatedRoute.snapshot.params['keySubmitSuccess'];
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
    this.myProducts = this.user.products;
  }

  public getUserProductsFromCache() {
    this.myProducts = this.user.products;
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

  public getAddNewKeyFrom() {
    this.addNewKeyForm = new FormGroup({
      userEmail: new FormControl(this.user.email),
      productTitle: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9 ]*$")]),
      productKeyDiscount: new FormControl('', [Validators.required, Validators.pattern("100|[1-9]?[0-9]")]),// only numbers between 0 and 100
      productKeyPrice: new FormControl('', [Validators.required, Validators.pattern("^[1-9][0-9]?$|^500$")]),// only numbers between 0 and 500
      activationKey: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")])
    })
  }

  public getUpdateProductPriceFrom() {
    this.updateProductPriceFrom = new FormGroup({
      productId: new FormControl(''),
      productKeyPrice: new FormControl('', [Validators.required, Validators.pattern("^[1-9][0-9][0-9]?$|^500$")]),
      productKeyDiscount: new FormControl('', [Validators.required, Validators.pattern("100|[1-9]?[0-9]")]),// only numbers between 0 and 500
    })
  }

  // public getNewKeyFrom() {
  //   this.newKeyForm = new FormGroup({
  //     userEmail: new FormControl(this.user.email),
  //     productTitle: new FormControl('', [Validators.required]),
  //     productKeyPrice: new FormControl('', [Validators.required]),// only numbers between 0 and 500
  //     activationKey: new FormControl('', [Validators.required])
  //   })
  // }

  public getUserProducts() {
    this.subscriptions.push(
      this.productService.getUserProducts(this.user.email).subscribe({
        next: (products: Product[]) => {
          this.myProducts = products;

        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public onAddNewKeySubmit() {
    const formData = new FormData;
    formData.append('userEmail', this.user.email);
    formData.append('productTitle', this.addNewKeyForm.value.productTitle);
    formData.append('productKeyPrice', this.addNewKeyForm.value.productKeyPrice);
    formData.append('productKeyDiscount', this.addNewKeyForm.value.productKeyDiscount)
    formData.append('activationKey', this.addNewKeyForm.value.activationKey);

    this.subscriptions.push(
      this.productService.addNewKeyToUserProducts(formData).subscribe({
        next: (updatedProduct: Product) => {
          let foundProduct = this.myProducts.find(product => product.id == updatedProduct.id)
          if (foundProduct != null) {
            let foundIndex = this.myProducts.findIndex(product => product.id == updatedProduct.id)
            this.myProducts[foundIndex] = updatedProduct;
          } else {
            this.myProducts.push(updatedProduct);
          }
          this.user.products = this.myProducts;
          this.dataSharingService.products.next(this.myProducts);
          this.authService.addUserToLocalCache(this.user);
          //alert(updatedProduct.id);

          this.keySubmitSuccess = 'success';
          this.addNewKeyForm.reset();
          // this.router.navigate(['/inventory', this.keySubmitSuccess]).then(() => {
          //   window.location.reload();
          // });

          //this.router.navigate(['currentUrl', this.keySubmitSuccess]);
          //this.reloadCurrentRoute();

        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
          this.keySubmitSuccess = 'failed';
          this.router.navigate(['/inventory', this.keySubmitSuccess]).then(() => {
            window.location.reload();
          });
        }
      })
    );
  }

  public onUpdateKeyPriceSubmit(): void {
    const formData = new FormData;
    formData.append('productId', this.updateProductPriceFrom.value.productId);
    formData.append('productKeyPrice', this.updateProductPriceFrom.value.productKeyPrice);
    formData.append('productKeyDiscount', this.updateProductPriceFrom.value.productKeyDiscount);
    let index;
    this.subscriptions.push(
      this.productService.updateProductKeyPrice(formData).subscribe({
        next: (updatedProduct: Product) => {
          let foundIndex = this.myProducts.findIndex(product => product.id == updatedProduct.id)
          this.myProducts[foundIndex] = updatedProduct;

          this.dataSharingService.products.next(this.myProducts);

          this.user.products = this.myProducts;
          this.authService.addUserToLocalCache(this.user);

          this.updateProductPriceFrom.reset();
          // this.router.navigate(['/inventory']).then(() => {
          //   window.location.reload();
          // });
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);

        }
      })
    );
  }

  public setProductId(prodcutId: number) {
    this.updateProductPriceFrom.value.productId = prodcutId;
  }

  public onRemoveKey(activationKey: string, productTitle: string): void {
    const formData = new FormData;
    formData.append('activationKey', activationKey);
    formData.append('userEmail', this.user.email);
    formData.append('productTitle', productTitle);

    this.subscriptions.push(
      this.productService.deleteKeyFromProduct(formData).subscribe({
        next: (updatedProduct: Product) => {
          if (updatedProduct.productKeys.length != 0) {
            let foundIndex = this.myProducts.findIndex(product => product.id == updatedProduct.id)
            this.myProducts[foundIndex] = updatedProduct;
          } else {
            let newProducts = this.myProducts.filter(product => product.id !== updatedProduct.id) // filter and keep only the products that don't have that id (remove product with that id)
            this.myProducts = newProducts;
          }
          this.dataSharingService.products.next(this.myProducts);

          this.user.products = this.myProducts;
          this.authService.addUserToLocalCache(this.user);
          //alert(updatedProduct.id)

          // this.router.navigate(['/inventory']).then(() => {
          //   window.location.reload();
          // });
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);

        }
      })
    );
  }


  public showProductEdit(productTitle: string) {
    this.editProduct = productTitle;
    this.openProductEdit = !this.openProductEdit;
  }

  public reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl, this.keySubmitSuccess]);
    });
  }

  public showNewKeyForm(): boolean {
    return this.openNewKeyForm = !this.openNewKeyForm;
  }

  public get getUserEmail() {
    return this.addNewKeyForm.get('userEmail');
  }

  public get getProductTitle() {
    return this.addNewKeyForm.get('productTitle');
  }

  public get getProductKeyPrice() {
    return this.addNewKeyForm.get('productKeyPrice');
  }

  public get getActivationKey() {
    return this.addNewKeyForm.get('activationKey');
  }

  public get getProductKeyDiscount() {
    return this.addNewKeyForm.get('productKeyDiscount');
  }

  public get getKeyPrice() {
    return this.updateProductPriceFrom.get('productKeyPrice');
  }

  public get getKeyDiscount() {
    return this.updateProductPriceFrom.get('productKeyDiscount');
  }

}
