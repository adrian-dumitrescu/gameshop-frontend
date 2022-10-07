import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { param } from 'jquery';
import { Role } from 'src/app/enum/role';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users!: User[];
  public user!: User;
  public userRole!: string;
  public profileImageModal!: boolean;
  selectedUser: any;

  constructor(private userService: UserService, 
    private authService: AuthenticationService, 
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
    this.roleToString();
  }

  public getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => { this.users = response }, // completeHandler
      error: (error: HttpErrorResponse) => { alert(error.message) }
    });
  }


  private roleToString(): string {
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



  public clickUser(user: any) {
    this.selectedUser = user;
    console.log("User data is: " + JSON.stringify(this.selectedUser));
    console.log("User's email is: " + user.email);

    // V1:
    // .subscribe((response: User[]) => {
    //   this.users = response;
    // },
    // (error: HttpErrorResponse) =>{
    //   alert(error.message);
    // });

    //V2
    //   .subscribe({
    //     complete: () => { ... }, // completeHandler
    //     error: () => { ... },    // errorHandler 
    //     next: () => { ... },     // nextHandler
    //     someOtherProperty: 42});
  }
}
