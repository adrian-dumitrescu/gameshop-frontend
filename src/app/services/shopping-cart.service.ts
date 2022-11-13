import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../interfaces/custom-http-response';
import { ShoppingCart } from '../model/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private apiServerURL = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  public addItemToShoppingCart(newItemForm: FormData): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.apiServerURL}/shopping-cart/add/item`, newItemForm);
  }

  public deleteItemFromShoppingCartByTitle(formData: FormData): Observable<any>{
    return this.http.request<any>('delete',this.apiServerURL + '/shopping-cart/delete/item/by-title', { body: formData});
  }

  public deleteItemFromShoppingCartById(cartItemId: number): Observable<ShoppingCart>{
    return this.http.delete<ShoppingCart>(`${this.apiServerURL}/shopping-cart/delete/item/${cartItemId}`);
  }




  // public addShoppingCartToLocalCache(shoppingCart: ShoppingCart): void {
  //   localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
  // }

  // public getShoppingCartFromLocalCache(): ShoppingCart {
  //   // if ShoppingCart is not null, return shoppingCart, else return empty json
  //   return JSON.parse(localStorage.getItem('shoppingCart') || '{}');
  // }

}
