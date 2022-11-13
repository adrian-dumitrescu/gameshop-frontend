import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../interfaces/custom-http-response';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  private apiServerURL = environment.apiBaseUrl;
  //private url = this.apiServerURL + '/product/delete/key'
  
  constructor(private http: HttpClient) { }

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerURL}/product/all`);
  }

  public getUserProducts(userEmail: String): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerURL}/product/all/${userEmail}`);
  }

  public deleteKeyFromProduct(formData: FormData): Observable<any>{
    return this.http.request<any>('delete',this.apiServerURL + '/product/delete/key', { body: formData});
  }

  // public deleteKeyFromProduct(formData: FormData): Observable<any>{
  //   return this.http.request<any>(`${this.apiServerURL}/product/delete/key`, {formData});
  // }

  public updateProductKeyPrice(formData: FormData): Observable<Product>{
    return this.http.put<Product>(`${this.apiServerURL}/product/update/price`, formData);
  }

  public addNewKeyToUserProducts(newKeyForm: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiServerURL}/product/add/key`, newKeyForm);
  }

  // public login(loginForm: LoginForm): Observable<HttpResponse<User>> {
  //   return this.http.post<User>(`${this.apiServerURL}/user/login`,loginForm, { observe: 'response' })
  //   //return this.http.get<User>(this.apiServerURL + "/user/login/" + userEmail + "/"+ userPassword);
  // }

  public addProductsToLocalCache(products: Product[]): void {
    localStorage.setItem('products', JSON.stringify(products));
  }

  public getProductsFromLocalCache(): Product[] {
    // if User is not null, return user, else return empty json
    return JSON.parse(localStorage.getItem('products') || '{}');
  }

}
