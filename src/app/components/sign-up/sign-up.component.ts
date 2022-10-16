import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap, Params } from "@angular/router";
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  user!: User;

  constructor(private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private notificationService: NotificationService) { }

  registerForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  termsAccepted: boolean = false;
  userCreatedSuccesfully: boolean = false;
  emailAlreadyExists: boolean = false;

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/main');
    }
    this.getRegisterForm();
 
  }

  public getRegisterForm(){
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.nullValidator, Validators.pattern("[a-zA-Z ]*")]),
      lastName: new FormControl('', [Validators.required, Validators.nullValidator, Validators.pattern("[a-zA-Z ]*")]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-zd!@#$%^&*()_+].{8,15}")])
      //"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}"
         // At least 8 characters in length
    // Lowercase letters
    // Uppercase letters
    // Numbers Special characters
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  public onOpenModal(mode: string): void {

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', '#modal');
    if (mode === 'close') {
      button.setAttribute('data-target', '#closeModal');
    }
    if (mode === 'save') {
      button.setAttribute('data-target', '#saveModal');
    }

  }
  
  get getFirstName() {
    return this.registerForm.get('firstName');
  }
  get getLastName() {
    return this.registerForm.get('lastName');
  }
  get getEmail() {
    return this.registerForm.get('email');
  }
  get getPassword() {
    return this.registerForm.get('password');
  }

  toggleUserCreatedSucessfullyModal() {
    if (this.userCreatedSuccesfully) {
      //this.router.navigate(['/sign-in']);
    }
  }

  getUserCreationStatus() {
    return this.userCreatedSuccesfully;
  }


  // submitSignUpFormData() {
  //   this.userService.createUser(this.userSignUpForm.value).subscribe({
  //     next: (response: User) => {
  //       this.user = response;
  //       this.userCreatedSuccesfully = true;
  //       //alert(this.user.roles);
  //       this.router.navigate([`/sign-in`, this.userCreatedSuccesfully]);
  //       //this.router.navigate([`/sign-in/`]);
  //     }, // completeHandler
  //     error: (errorResponse: Response) => {
  //       if (errorResponse.status == 400) {
  //         this.emailAlreadyExists = true;
  //         //alert(errorResponse.status);
  //       }
  //     }
  //     //error: (error: HttpErrorResponse) => { alert(error.message) }
  //   });

  // }
  public onRegister(): void {
    this.subscriptions.push(
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: User) => {
          this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.firstName}.
          Please check your email for password to log in.`);
          this.userCreatedSuccesfully = true;
          this.router.navigate([`/sign-in`, this.userCreatedSuccesfully]);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          if (errorResponse.status == 400) {
            this.emailAlreadyExists = true;
          }
        }
      })
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  toggleCheckbox() {
    this.termsAccepted = !this.termsAccepted;
  }


}
