import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { Gender } from "src/app/enum/gender";
import { Country } from 'src/app/enum/country';
import { GenderMapping } from 'src/app/constants/constant';
import { CountryMapping } from 'src/app/constants/constant';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit,OnDestroy {

  private subscriptions: Subscription[] = [];
  public user!: User;
  public profileImage!: File;
  public userCardForm!: FormGroup;
  public genderMapping = GenderMapping;
  public countryMapping = CountryMapping;


  constructor(private userService: UserService,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getUser();
    this.getUserCardForm();

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  public getUser(){
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
      console.log(this.user.nickname)
    }
  }
  

  public getUserCardForm(){
    this.userCardForm = new FormGroup({
      email: new FormControl(this.user.email),
      firstName: new FormControl(this.user.firstName, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
      lastName: new FormControl(this.user.lastName, [Validators.required, Validators.pattern("[a-zA-Z ]*")]),
      nickname: new FormControl(this.user.nickname, [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")]),
      gender: new FormControl(this.user.gender, [Validators.required]),
      country: new FormControl(this.user.country, [Validators.required]),
      age: new FormControl(this.user.age, [Validators.required, Validators.pattern("^[1-9][0-9]?$|^100$")]) // only numbers between 0 and 100
    })
  }

  public get getFirstName() {
    return this.userCardForm.get('firstName');
  }

  public get getLastName() {
    return this.userCardForm.get('lastName');
  }

  public get getNickname() {
    return this.userCardForm.get('nickname');
  }

  public get getAge() {
    return this.userCardForm.get('age');
  }


  public userHasSetGender(): boolean {
    if (this.user.gender == null || '') {
      return true
    } else {
      return false
    }
  }

  public userHasSetCountry(): boolean {
    if (this.user.country == null || '') {
      return true
    } else {
      return false
    }
  }


  // public onCardSubmit() {
  //   this.userService.updateUserCard(this.userCardForm.value).subscribe({
  //     next: (response: User) => {

  //     },
  //     error: (errorResponse: HttpErrorResponse) => {
  //       console.log(errorResponse.error.message);
  //     }
  //   })
  // }

  public onCardSubmit() {
    const formData = new FormData;
    formData.append('email', this.userCardForm.value.email);
    formData.append('firstName', this.userCardForm.value.firstName);
    formData.append('lastName', this.userCardForm.value.lastName);
    formData.append('nickname', this.userCardForm.value.nickname);
    formData.append('gender', this.userCardForm.value.gender);
    formData.append('country', this.userCardForm.value.country);
    formData.append('age', this.userCardForm.value.age);

    this.subscriptions.push(
      this.userService.updateUserCard(formData).subscribe({
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
