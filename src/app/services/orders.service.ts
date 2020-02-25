import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ToppingsModel } from '../models/toppingsModel';
import { OrderModel } from '../models/orderModel';
import { PizzaModel } from '../models/pizzaModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService implements OnInit {
  public toppingsLoaded: EventEmitter<ToppingsModel[]> = new EventEmitter<ToppingsModel[]>();
  public orderLoaded: EventEmitter<OrderModel> = new EventEmitter<OrderModel>();
  public orderSaved: EventEmitter<OrderModel> = new EventEmitter<OrderModel>();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {

  }

  public loadToppings() {
    this.httpClient
    .get<ToppingsModel[]>(`${environment.apiUrl}api/toppings`, this.httpOptions)
    .pipe(retry(2), catchError(this.handleError<ToppingsModel[]>('loadToppings', [])))
    .subscribe((toppings: ToppingsModel[]) => {
      this.toppingsLoaded.next(toppings);
    });
  }

  public saveOrder(order: OrderModel) {
    this.httpClient
    .post(`${environment.apiUrl}api/orders`, JSON.stringify(order), this.httpOptions)
    .pipe(catchError(this.handleError<OrderModel>('saveOrder', null)))
    .subscribe((order: OrderModel) => {
      this.orderSaved.next(order);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);

      return of(result as T);
    };
  }
}
