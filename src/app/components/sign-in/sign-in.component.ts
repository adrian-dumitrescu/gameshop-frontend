import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/model/user';
import { Role } from 'src/app/model/role';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type';
import { NotificationService } from 'src/app/services/notification.service';
import { NotificationType } from 'src/app/enum/notification-type';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  public loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];
  rolee!: Role;
  registrationSuccess!: boolean;
  showNotificationBanner!: boolean;
  notificationMessage!: string;

  constructor(private authService: AuthenticationService, 
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService) { }

  
  ngOnInit(): void {
    //this.ngAfterViewInit();
    //this.userCreatedStatus = this.signUpComponent.getUserCreationStatus();
    //console.log(this.signUpComponent.getUserCreationStatus());
    //this.loadRegisterSuccessMessage();

    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/main']);
    } else if(this.activatedRoute != null){
      this.registerSuccessMessageParam();
    }else{
      this.router.navigateByUrl('/sign-in')
    };
    //console.log(this.userCreatedStatus);
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

        // this.loginForm = new FormGroup({
    //   email: new FormControl(['', Validators.required]),
    //   password: new FormControl(['', Validators.required])
    // })

  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  registerSuccessMessageParam(): void {
    this.registrationSuccess = this.activatedRoute.snapshot.params['registrationSuccess'];
  }


  // submitSignInFormData() {
  //   //this.authService.login(this.userSignInForm.value.email, this.userSignInForm.value.password).subscribe({
  //   this.authService.login(this.userSignInForm.value).subscribe({  
  //   next: (response: User) => { 
  //       this.user = response;
  //       //alert(JSON.stringify(this.user.roles));

  //       alert(this.user.roles[0].role)
  //       // this.user.roles.forEach(element =>{
  //       //   alert(element.role);
  //       // })
  //       // alert(this.user.roles.map(element =>{
  //       //   alert(element.role);
  //       // }));



  //       //this.user.roles[1];

  //       //console.log(this.user)


  //       //alert(this.user.roles.values().next().value);
  //       //alert(this.user.roles.values); // testing roles


  //       this.goToMainPage();
  //     }, // completeHandler
  //     error: (error: HttpErrorResponse) => { 
  //       alert(error.message) }
  //   });


  //   // .subscribe(
  //   //   data => {
  //   //     console.log("Registration sucessful");
  //   //     this.goToMainPage();
  //   //   }, error => console.log(error))

  // }


  public onLogin(): void {
    this.subscriptions.push(
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authService.saveToken(token !== null ? token : ''); // if token is null, return ''
          if (response.body !== null) {
            this.authService.addUserToLocalCache(response.body);
          }
          this.authService.setIsAuthenticated(true);
          this.sendNotification(NotificationType.SUCCESS, "You have succesfully logged in");
          this.goToMainPage();
          
        }, // completeHandler
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      }
      )
    );
  }


  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
      this.notificationMessage = message;
      this.showNotificationBanner = true;
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
      this.notificationMessage = 'An error occurred. Please try again.';
      this.showNotificationBanner = true;
    }
  }


  goToMainPage() {
    this.router.navigate([`/main`]);
  }

}
