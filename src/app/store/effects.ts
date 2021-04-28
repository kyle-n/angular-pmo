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

  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) {}

}