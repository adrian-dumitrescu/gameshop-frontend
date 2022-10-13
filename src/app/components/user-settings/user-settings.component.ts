import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  public user!: User;
  public formChangeEmail!: FormGroup;
  
  constructor(private userService: UserService,
    private authService:AuthenticationService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.user = this.authService.getUserFromLocalCache();
    }

    this.formChangeEmail = this.formBuilder.group({
      currentEmail: [this.user.email, Validators.required],
      newEmail: ['', Validators.required]
    })

  }

  public onChangeEmail(){
    alert(this.formChangeEmail.value.currentEmail);
    alert(this.formChangeEmail.value.newEmail);
  }
}
