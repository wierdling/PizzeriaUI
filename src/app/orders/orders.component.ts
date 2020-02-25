import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { OrderModel } from '../models/orderModel';
import { PizzaModel } from '../models/pizzaModel';
import { ToppingsModel } from '../models/toppingsModel';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public crusts: string[] = ['Pan', 'Thin', 'Hand Tossed'];
  public sizes: string[] = ['Small', 'Medium', 'Large', 'Monster'];
  public toppings: ToppingsModel[] = [];
  public currentOrder: OrderModel = null;
  public currentToppings: string[] = [];
  public selectedTopping = null;
  public selectedCrust = '';
  public selectedSize = '';
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly orderService: OrdersService,
    public snackBar: MatSnackBar
  ) {
    this.subscription.add(this.orderService.toppingsLoaded.subscribe((toppings: ToppingsModel[]) => {
      this.toppings = toppings;
    }));
    this.subscription.add(this.orderService.orderSaved.subscribe((order: OrderModel) => {
      this.showToast('Your pizza order has been submitted.', 'Submitted!');
      this.deleteOrder();
    }));
   }

  ngOnInit(): void {
    this.orderService.loadToppings();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public deleteOrder() {
    this.currentOrder = null;
    this.currentToppings = [];
    this.selectedSize = '';
    this.selectedCrust = '';
  }

  public deleteTopping(topping: string) {
    for(let i = 0; i < this.currentToppings.length; i++) {
      if (this.currentToppings[i] === topping) {
        this.currentToppings.splice(i, 1);
        return;
      }
    }
  }

  public deletePizzaTopping(pizza: PizzaModel, topping: string) {
    for (let i = 0; i < pizza.toppings.length; i++) {
      if (pizza.toppings[i] === topping) {
        pizza.toppings.splice(i, 1);
        return;
      }
    }
  }

  public addTopping() {
    if (this.selectedTopping) {
      this.currentToppings.push(this.selectedTopping);
    }
  }

  public addToOrder() {
    let isValid = true;
    if (!this.selectedCrust || this.selectedCrust === '') {
      this.showToast('Please slect a crust.', 'Invalid Selection');
      isValid = false;
    }

    if (!this.selectedSize || this.selectedSize === '') {
      this.showToast('Please slect a size.', 'Invalid Selection');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const pizza: PizzaModel = new PizzaModel(null, this.currentToppings, this.selectedCrust, this.selectedSize);
    this.currentToppings = [];
    const pizzas: PizzaModel[] = [];
    pizzas.push(pizza);
    if (null == this.currentOrder) {
    this.currentOrder = new OrderModel(null, new Date().toString(), pizzas, new Date());
    } else {
      this.currentOrder.pizzas.push(pizza);
    }
  }

  public submitOrder() {
    if (this.currentOrder && this.currentOrder.pizzas.length > 0) {
      this.orderService.saveOrder(this.currentOrder);
    }
  }

  public removePizzaFromOrder(index: number) {
    this.currentOrder.pizzas.splice(index, 1);
  }

  private showToast(message: string, action: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2000;
    this.snackBar.open(message, action, config);
  }
}
