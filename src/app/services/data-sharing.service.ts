import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../model/product';
import { ShoppingCart } from '../model/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  public shoppingCart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>(new ShoppingCart);
  public products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  constructor() { }
}
