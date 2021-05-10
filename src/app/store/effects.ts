import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Order, OrderService } from "../order/order.service";
import { ActionType } from "./actions";
import { filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { createOrder } from './actions';
import {ClearAsyncErrorAction, SetAsyncErrorAction, SetValueAction, StartAsyncValidationAction} from 'ngrx-forms';
import { from } from 'rxjs';
import isValidUSNumber from '../phone-validator';

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

  @Effect()
  validatePhoneNumber$ = this.actions$.pipe(
    ofType(SetValueAction.TYPE),
    filter((formControlUpdate: SetValueAction<string>) => formControlUpdate.controlId === 'order_form_id.phone'),
    switchMap(formControlUpdate => {
      const errorKey = 'validPhone'
      return from(isValidUSNumber(formControlUpdate.value)).pipe(
        map(validPhone => {
          return validPhone ? new ClearAsyncErrorAction(formControlUpdate.controlId, errorKey) : new SetAsyncErrorAction(formControlUpdate.controlId, errorKey, true);
        }),
        startWith(new StartAsyncValidationAction(formControlUpdate.controlId, errorKey))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private orderService: OrderService
  ) {}

}