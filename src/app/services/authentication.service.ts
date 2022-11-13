import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormGroup } from '@angular/forms';
import { LoginForm } from '../model/login-form';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);
  //private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  public apiServerURL = environment.apiBaseUrl;
  private jwtHelper = new JwtHelperService();
  private token!: string | null;
  private guestUser!: User;
  private loggedInUsername!: string | null;


  constructor(private http: HttpClient, private productService: ProductService) {
    this.addGuestToLocalCache(this.guestUser);
   }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  setIsAuthenticated(authenticated: boolean) {
    this.isAuthenticated$.next(authenticated);
  }

  // getIsAuthenticated(): Observable<boolean> {
  //   return this.isAuthenticated$.asObservable();
  // }

  // setIsAuthenticated(authenticated: boolean) {
  //   this.isAuthenticated$.next(authenticated);
  // }

  //{ observe: 'response' } -> Means: "don't just give the body, I want the whole response, including the headers"
  // I need the header to process the JSON WEB TOKEN

  // //HTTP GET REQUEST
  // public login(user: User): Observable<HttpResponse<User>> {
  //   return this.http.post<User>(`${this.apiServerURL}/user/login`, user, { observe: 'response' });
  // }

  // OLDDDDDDDDDDDDD HTTP POST REQUEST
  public login(loginForm: LoginForm): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiServerURL}/user/login`,loginForm, { observe: 'response' })
    //return this.http.get<User>(this.apiServerURL + "/user/login/" + userEmail + "/"+ userPassword);
  }

  public register(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiServerURL}/user/register`, formData);
  }

  public isUserLoggedIn(): boolean{
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') { // sub == subject (username)
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          this.setIsAuthenticated(true);
          return true;
        }
        //alert("Token expired")
      }
      //alert("Token null")
    }
    this.logOut();
    //alert("no token...log out")
    return false;
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    this.setIsAuthenticated(false);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }


  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Get the token from the local storage
  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  // Get the saved token
  public getToken(): string {
    // if token is not null, return token, else return empty string
    //return this.token != null ? this.token : '';
    return this.token || '';
  }

  public addGuestToLocalCache(user: User): void {
    localStorage.setItem('guest', JSON.stringify(user));
  }

  public getGuestFromLocalCache(): User | undefined {
    // if Guest is not null, return user, else return empty json
    var guestUser = localStorage.getItem('guest');
    if (typeof guestUser !== 'undefined' && guestUser !== null){
      return undefined;
    }
    return JSON.parse(localStorage.getItem('guest') || '{}');
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    // if User is not null, return user, else return empty json
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache() {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }
    return null;
  }




}
