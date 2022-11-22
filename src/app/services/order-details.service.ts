import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderDetails } from '../model/order-details';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  private apiServerURL = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  public getAllOrderDetails(userEmail: any): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${this.apiServerURL}/order-details/all/${userEmail}`);
  }

  public createPurchaseOrder(formData: FormData): Observable<OrderDetails> {
    return this.http.post<OrderDetails>(`${this.apiServerURL}/order-details/purchase`, formData);
  }

}
