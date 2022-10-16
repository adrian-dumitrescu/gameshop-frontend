import { Component, OnInit } from '@angular/core';
import { CountryMapping, GenderMapping } from 'src/app/constants/constant';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  user!: User;
  public genderMapping = GenderMapping;
  public countryMapping = CountryMapping;

  constructor(private userService: UserService,
    private authService: AuthenticationService,) { }

  ngOnInit(): void {
    this.getAuthUser();
  }

  public getAuthUser() {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }
  }

  public getUserCountrySvg(): string {
    for (let userCountry of this.countryMapping) {
      if (userCountry.value == this.user.country) {
        return userCountry.svg;
      }
    }
    return 'xx.svg';
  }

  public showNameOrNickname(): string {
    if (this.user.nickname == null || '') {
      return this.user.firstName;
    } else {
      return this.user.nickname;
    }
  }

}
