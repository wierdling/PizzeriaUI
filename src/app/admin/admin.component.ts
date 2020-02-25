import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ToppingsModel } from '../models/toppingsModel';
import { AdminService } from '../services/admin.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public toppings: ToppingsModel[] = [];
  public topping: ToppingsModel;

  constructor(
    private readonly adminService: AdminService,
    private readonly orderService: OrdersService,
    public snackBar: MatSnackBar
  ) {
    this.subscription.add(this.orderService.toppingsLoaded.subscribe((toppings: ToppingsModel[]) => {
      this.toppings = toppings;
    }));
    this.subscription.add(this.adminService.toppingSaved.subscribe((topping: ToppingsModel) => {
      if (null != topping && null != topping.name) {
        this.toppings.push(topping);
        this.showToast(`Topping ${topping.name} created.`);
      }
    }));
  }

  ngOnInit(): void {
    this.orderService.loadToppings();
    this.topping = new ToppingsModel(null, null, 0);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public deleteTopping(id: string) {
    //  todo: implement
  }

  public addTopping() {
    //  todo: field validation
    this.adminService.saveTopping(this.topping);
  }

  private showToast(message: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 2000;
    this.snackBar.open(message, 'Loaded', config);
  }
}
