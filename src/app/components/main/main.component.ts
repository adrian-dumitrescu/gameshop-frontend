import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductDetails } from 'src/app/model/product-details';
import { ProductDetailsService } from 'src/app/services/product-details.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public myProductDetails!: ProductDetails[];
  public carouselProductDetails!: ProductDetails[];

  public imagePath: string = "../assets/game-card/";

  constructor(private productDetailsService: ProductDetailsService) { }


  ngOnInit(): void {
    this.getAllProductDetails();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getAllProductDetails() {
    this.subscriptions.push(
      this.productDetailsService.getAllProductDetails().subscribe({
        next: (productDetails: ProductDetails[]) => {
          let filteredProducts = productDetails?.filter(productDetails => productDetails?.id == 1 || 2 || 3) // filter and keep only the products that don't have that id (remove product with that id)

          this.carouselProductDetails = filteredProducts;
          console.log(this.carouselProductDetails[0].title);
          //   if(filteredProducts != null){
          //   this.carouselProductDetails.push(filteredProducts[0]);
          //   this.carouselProductDetails.push(filteredProducts[1]);
          //   this.carouselProductDetails.push(filteredProducts[2]);
          //   console.log(this.carouselProductDetails[0].title);
          // }
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public getProductDetailsTitle(productDetails: ProductDetails): string {
    if (productDetails.title != null) {
      return productDetails.title;
    }
    return "";
  }

  public getFirstProduct(): string {
    if (this.carouselProductDetails[0].title != null) {
      return this.carouselProductDetails[0].title;
    }
    return "";
  }

  public getProductDetailsByIndex(index: number): string {
    if (this.carouselProductDetails[index].title != null) {
      return this.carouselProductDetails[index].title;
    }
    return "";
  }


}
