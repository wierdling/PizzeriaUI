import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ToppingsModel } from '../models/toppingsModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements OnInit {
  public toppingSaved: EventEmitter<ToppingsModel> = new EventEmitter<ToppingsModel>();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {

  }

  public saveTopping(topping: ToppingsModel) {
    topping.id = null;
    topping.quantity = parseFloat(topping.quantity.toString());
    this.httpClient
    .post(`${environment.apiUrl}api/toppings`, JSON.stringify(topping), this.httpOptions)
    .pipe(catchError(this.handleError<ToppingsModel>('saveTopping', null)))
    .subscribe((topping: ToppingsModel) => {
      this.toppingSaved.next(topping);
    })
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
