import { Component, OnInit } from '@angular/core';
import { Order } from '../order.service';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { GlobalState } from 'src/app/store/reducers';
import { ActionType } from 'src/app/store/actions';

interface Data<T> {
  value: Array<T>;
  isPending: boolean;
}

@Component({
  selector: 'pmo-order-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  public orders: Data<Order> = {
    value: [],
    isPending: true
  }
  socket: SocketIOClient.Socket;

  constructor(
    private store: Store<GlobalState>
    ) { 
      this.socket = io(environment.apiUrl);

      store.pipe(
        select('order'),
        select('orders')
      ).subscribe((orders: Array<Order>) => this.orders.value = orders); // not the most ideal Rx way to do it, but integrating with existing project
    }

  ngOnInit() {
    this.store.dispatch({ type: ActionType.getOrders });

    this.socket.on('orders created', (order: Order) => {
      this.orders.value.push(order);
    });

    this.socket.on('orders updated', (order: Order) => {
      let orderIndex =  this.orders.value.findIndex(item => item._id === order._id);
      this.orders.value.splice(orderIndex, 1);
      this.orders.value.push(order);
    });

    this.socket.on('orders removed', (order: Order) => {
      let orderIndex =  this.orders.value.findIndex(item => item._id === order._id);
      this.orders.value.splice(orderIndex, 1);
    });
  }

  get newOrders() {
    let orders =  this.orders.value.filter((order) => {
      return order.status === "new";
    });
    return orders;
  }

   get preparingOrders() {
    let orders =  this.orders.value.filter((order) => {
      return order.status === "preparing";
    });
    return orders;
   }

   get deliveryOrders() {
    let orders =  this.orders.value.filter((order) => {
      return order.status === "delivery";
    });
    return orders;
   }

   get deliveredOrders() {
    let orders =  this.orders.value.filter((order) => {
      return order.status === "delivered";
    });
    return orders;
   }

}
