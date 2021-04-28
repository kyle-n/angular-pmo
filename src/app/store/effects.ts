import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order, OrderService } from "../order/order.service";
import { ActionType } from "./actions";
import { map, mergeMap } from 'rxjs/operators';
import { createOrder } from './actions';

@Injectable()
export class OrderEffects {

  @Effect() // <-- old @ngrx/effects syntax
  submitOrder$ = this.actions$.pipe( // <-- new syntax: submitOrder$ = createEffect(() => this.actions$.pipe(...
    ofType<ReturnType<typeof createOrder>>(ActionType.createOrder),
    mergeMap(action => {
      return this.orderService.createOrder(action.order).pipe(
        map((newOrder: Order) => ({ type: ActionType.createOrderSuccess, order: newOrder}))
      )
    })
  );

  @Effect()
  getOrders$ = this.actions$.pipe(
    ofType(ActionType.getOrders),
    mergeMap(() => this.orderService.getOrders().pipe(
      map((response: any) => ({ type: ActionType.getOrdersSuccess, orders: response.data }))
    ))
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) {}

}