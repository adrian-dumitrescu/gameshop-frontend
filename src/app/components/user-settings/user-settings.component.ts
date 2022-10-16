import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryMapping, GenderMapping } from 'src/app/constants/constant';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public user!: User;
  public formChangeEmail!: FormGroup;
  public formChangePassword!: FormGroup;


  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAuthUser();
    this.getChangePasswordForm();
    this.getChangeEmailForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
  }

  public getChangePasswordForm() {
    this.formChangePassword = new FormGroup({
      currentEmail: new FormControl(this.user.email, [Validators.required]),
      currentPassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-zd!@#$%^&*()_+].{8,15}")]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-zd!@#$%^&*()_+].{8,15}")])
    })
  }

  public getChangeEmailForm() {
    this.formChangeEmail = new FormGroup({
      currentEmail: new FormControl(this.user.email, [Validators.required]),
      newEmail: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    })
  }

  get getNewEmail() {
    return this.formChangeEmail.get('newEmail');
  }
  get getCurrentPassword() {
    return this.formChangePassword.get('currentPassword');
  }
  get getNewPassword() {
    return this.formChangePassword.get('newPassword');
  }

  public onChangePassword() {
    const formData = new FormData;
    formData.append('email', this.formChangePassword.value.currentEmail);
    formData.append('currentPassword', this.formChangePassword.value.currentPassword);
    formData.append('newPassword', this.formChangePassword.value.newPassword);
    this.subscriptions.push(
      this.userService.updatePassword(formData).subscribe({
        next: (newUser: User) => {
          this.authService.addUserToLocalCache(newUser);
          window.location.reload()
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }

  public onChangeEmail() {
    const formData = new FormData;
    formData.append('currentEmail', this.formChangeEmail.value.currentEmail);
    formData.append('newEmail', this.formChangeEmail.value.newEmail);
    this.subscriptions.push(
      this.userService.updateEmail(formData).subscribe({
        next: (newUser: User) => {
          this.authService.addUserToLocalCache(newUser);
          window.location.reload()
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      })
    );
  }


}
