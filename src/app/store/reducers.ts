import { ValidationErrors } from '@angular/forms';
import { createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate } from "ngrx-forms";
import { required } from 'ngrx-forms/validation';
import { Order } from "../order/order.service";
import { ActionType } from "./actions";

// obviously incomplete, just for this example
export type GlobalState = {
  orders: Array<Order>
  mostRecentOrder?: Order;
  orderForm: FormGroupState<Order>;
}

const ORDER_FORM_ID = 'order_form_id';
const initialOrderFormState = createFormGroupState<Order>(ORDER_FORM_ID, {
  _id: '',
  name: null,
  address: null,
  phone: null,
  status: '',
  items: []
});

interface NoChrisValidationError<T> {
  actual: T | null | undefined;
}
declare module 'ngrx-forms/src/state' {
  interface ValidationErrors {
    noChris?: NoChrisValidationError<any>
  }
}

const noChris = (name: string | null | undefined): ValidationErrors => {
  const errors: ValidationErrors = {};
  if (name && name.toLowerCase() === 'chris') {
    errors.noChris = 'No one named Chris!'
  }
  return errors;
}

export const initialState: GlobalState = {
  orders: [],
  mostRecentOrder: null,
  orderForm: initialOrderFormState
};

const validateOrderForm = updateGroup<Order>({
  name: validate(required, noChris),
  address: validate(required),
  phone: validate(required)
});

export function reducer(
  state = initialState,
  action: any // normally this would be a union type of your action objects
): GlobalState {
  const orderForm = validateOrderForm(formGroupReducer(state.orderForm, action));
  if (orderForm !== state.orderForm) {
    state = {...state, orderForm};
  }
  switch (action.type) {
    case ActionType.createOrderSuccess:
      const orders = [...state.orders, action.order];
      return {...state, orders, mostRecentOrder: action.order};
    case ActionType.getOrdersSuccess:
      return {...state, orders: action.orders};
    case ActionType.clearOrderForm:
      return {...state, orderForm: initialOrderFormState};
    default:
      return state;
  }
}
