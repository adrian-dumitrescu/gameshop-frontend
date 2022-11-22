import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductDetails } from '../model/product-details';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  private apiServerURL = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  public getAllProductDetails(): Observable<ProductDetails[]> {
    return this.http.get<ProductDetails[]>(`${this.apiServerURL}/product-details/all`);
  }

  public getProductDetailsById(productId: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.apiServerURL}/product-details/title/${productId}`);
  }

}
