import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { CustomHttpResponse } from '../interfaces/custom-http-response';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private apiServerURL = "http://localhost:3000";
  private apiServerURL = environment.apiBaseUrl;

  //loggedIn!: boolean;

  constructor(private http: HttpClient) {

   }

  //HTTP GET REQUEST
  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerURL}/user/all`);
  }

  //HTTP PUT(UPDATE) REQUEST
  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerURL}/user/update`, user);
  }

  public updateUserCard(userCardForm: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiServerURL}/user/update/card`, userCardForm);
  }

  public updateEmail(userEmailForm: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiServerURL}/user/update/email`, userEmailForm);
  }

  public updatePassword(userPasswordForm: FormData): Observable<User> {
    return this.http.put<User>(`${this.apiServerURL}/user/update/password`,userPasswordForm);
  }

  //HTTP DELETE REQUEST
  public deleteUser(userId: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.apiServerURL}/user/delete/${userId}`);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.apiServerURL}/user/resetpassword/${email}`);
  }

  public findUserById(userId: number): Observable<User>{
    return this.http.get<User>(`${this.apiServerURL}/user/find/${userId}`);
  }


  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] | null {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users') || '');
    }
    return null;
  }

  public createUserFormDate(loggedInEmail: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentEmail', loggedInEmail);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    //formData.append('roles', user.roles[0].role);
    formData.append('roles', JSON.stringify(user.roles));
    formData.append('profileImage', profileImage);
    formData.append('isEnabled', JSON.stringify(user.isEnabled));
    formData.append('isNotLocked', JSON.stringify(user.isNotLocked));
    return formData;
  }

  
}
