import { ValidationErrors } from '@angular/forms';
import { box, Boxed, createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate } from "ngrx-forms";
import { required } from 'ngrx-forms/validation';
import { Item, Order } from "../order/order.service";
import { ActionType } from "./actions";

// obviously incomplete, just for this example
export type GlobalState = {
  orders: Array<Order>
  mostRecentOrder?: Order;
  orderForm: FormGroupState<OrderFormState>;
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
type OrderFormState = Override<Order, {items: Boxed<Array<Item>>}>;

const ORDER_FORM_ID = 'order_form_id';
const initialOrderFormState = createFormGroupState<OrderFormState>(ORDER_FORM_ID, {
  _id: '',
  name: null,
  address: null,
  phone: null,
  status: '',
  items: box([])
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

const validateOrderForm = updateGroup<OrderFormState>({
  name: validate(required, noChris),
  address: validate(required),
  phone: validate(required),
  items: validate(required)
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
