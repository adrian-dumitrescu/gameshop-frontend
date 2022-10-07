import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from '../services/notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    return this.isUserLoggedIn();
  }
  

  // Checks if the one who is accessing the request (for example //get all) is logged in. 
  // The guard is checking if a particular user Can Activate a certain route
  // If it returns true, then it's allowed to access that resource/page
  // It has to return a boolean (true/false)
  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/sign-in']);
    this.notificationService.notify(NotificationType.ERROR, `You need to sign in to access this page`);
    return false;
  }
}
