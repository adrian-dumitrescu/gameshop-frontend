import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/enum/role';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public users!: User[];
  public user!: User;
  public myProducts!: Product[];
  public userRole!: string;
  public profileImageModal!: boolean;
  public fileName!: string;
  public profileImage!: File;



  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private dataSharingService: DataSharingService,
    private productService: ProductService) {
    this.subscriptions.push(
      this.dataSharingService.products.subscribe(products => {
        this.myProducts = products;
      })
    );
  }
  

  ngOnInit(): void {
    this.getAuthUser();
    this.user = this.authService.getUserFromLocalCache();
    this.getUserProducts();
    this.getRoleToString();
    //this.myProducts = this.user.products;

    //console.log(this.products[0]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
      this.myProducts = this.user.products;
    }
  }

  public getUserProducts() {
    this.subscriptions.push(
      this.productService.getUserProducts(this.user.email).subscribe({
        next: (products: Product[]) => {
          this.myProducts = products;
          this.dataSharingService.products.next(this.myProducts);
          this.authService.addUserToLocalCache(this.user);
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public getNumberOfListedKeys(): number {
    let totalKeys: number = 0;
    this.myProducts.forEach(product => {
      totalKeys = totalKeys + product?.productKeys?.length;
    })
    return totalKeys;
  }

  public getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => { this.users = response }, // completeHandler
      error: (error: HttpErrorResponse) => { alert(error.message) }
    });
  }

  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName = fileName;
    this.profileImage = profileImage;
  }


  public showNameOrNickname(): string {
    if (this.user.nickname == null || '') {
      return this.user.firstName;
    } else {
      return this.user.nickname;
    }
  }


  private getRoleToString(): string {
    if (this.isAdmin) {
      return this.userRole = "Admin";
    }
    else {
      return this.userRole = "User";
    }
  }

  private getUserRole(): string {
    return this.authService.getUserFromLocalCache().roles[0].role;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isUser(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public openProfileImageModal() {
    this.profileImageModal = true;
  }

  public closeProfileImageModal() {
    this.profileImageModal = false;
  }

}
