import { PizzaModel } from './pizzaModel';

export class OrderModel {
    constructor(public id: string, public orderId: string, public pizzas: PizzaModel[], public orderDate: Date) {}
}
