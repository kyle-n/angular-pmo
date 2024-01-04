import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../restaurant/restaurant.service';

export interface Item {
  name: string;
  price: number;
}

export interface Order {
  _id: string;
  name: string;
  address: string;
  phone: string;
  status: string;
  items: Item[];
}

interface CreateOrderDto {
  name: string;
  address: string;
  phone: string;
  status?: string;
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  getOrders() {
    return this.httpClient.get<Config<Order>>('/api/orders');
  }

  createOrder(order: CreateOrderDto): Observable<Order> {
    const orderData = { ...order, status: 'new' };
    return this.httpClient.post<Order>('/api/orders', orderData);
  }

  updateOrder(order: Order, action: string) {
    const orderData = Object.assign({}, order);
    orderData.status = action;
    return this.httpClient.put('/api/orders/' + orderData._id, orderData);
  }

  deleteOrder(id: string) {
    return this.httpClient.delete('/api/orders/' + id);
  }
}
