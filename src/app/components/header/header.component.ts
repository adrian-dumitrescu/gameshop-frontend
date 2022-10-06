import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SignInComponent } from '../sign-in/sign-in.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  user!: User;
  isAuthenticated!:boolean;
  openSearchBar: boolean = false;
  public headerSignInForm!: FormGroup;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };

  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
    //alert(this.userIsAuthenticated);
    this.subscription = this.authService.getIsAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.user = this.authService.getUserFromLocalCache();  
      this.isAuthenticated = isAuthenticated;     
        
    });
    // this.headerSignInForm = this.formBuilder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required]
    // })

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // ngOnInit(): void {
  //   if (this.authService.isUserLoggedIn()) {
  //     this.user = this.authService.getUserFromLocalCache();
  //   }
  //   this.subscription = this.authService.getIsAuthenticated().subscribe((isAuthenticated: boolean) => {
  //     if (isAuthenticated){
  //       this.userIsAuthenticated = isAuthenticated;     
  //       this.user = this.authService.getUserFromLocalCache();
  //     }else{
  //       this.userIsAuthenticated = isAuthenticated;
  //     }
  //   });
  //   // this.headerSignInForm = this.formBuilder.group({
  //   //   email: ['', Validators.required],
  //   //   password: ['', Validators.required]
  //   // })

  // }


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



  // headerSignIn(){
  //   this.userService.login(this.headerSignInForm.value.email, this.headerSignInForm.value.password).subscribe({
  //     next: (response: User) => { this.user = response, this.signIn.goToMainPage()}, // completeHandler
  //     error: (error: HttpErrorResponse) => { alert(error.message) }
  //   });
  // }

}
