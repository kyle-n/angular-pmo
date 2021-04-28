import { createAction, props } from '@ngrx/store';
import { Order } from '../order/order.service';

export enum ActionType {
  createOrder = 'createOrder',
  createOrderSuccess = 'createOrderSuccess',
  getOrders = 'getOrders',
  getOrdersSuccess = 'getOrdersSuccess'
}

export const createOrder = createAction(
  ActionType.createOrder,
  props<{ order: Order }>()
);

export const createOrderSuccess = createAction(
  ActionType.createOrderSuccess,
  props<{ order: Order }>()
);

export const getOrders = createAction(
  ActionType.getOrders
);
