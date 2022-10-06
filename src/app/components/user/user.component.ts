import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selectedUser:any;

  constructor(private userService: UserService,private authService:AuthenticationService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
  }

  public getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: User[]) => { this.users = response }, // completeHandler
      error: (error: HttpErrorResponse) => { alert(error.message) }
    });

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
