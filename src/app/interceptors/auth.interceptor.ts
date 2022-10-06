import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(originalHttpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (originalHttpRequest.url.includes(`${this.authenticationService.apiServerURL}/user/login`)) {
      return httpHandler.handle(originalHttpRequest);
    }
    if (originalHttpRequest.url.includes(`${this.authenticationService.apiServerURL}/user/register`)) {
      return httpHandler.handle(originalHttpRequest);
    }
    
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    // We have to clone the request because the request is immutable. Meaning that we can't make any changes to it.
    // We have to clone, make the change to the clone and then pass it in the handler
    const request = originalHttpRequest.clone({ setHeaders: { Authorization: `Bearer ${token}` }});
    return httpHandler.handle(request);
  }
}