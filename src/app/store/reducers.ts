import { createFormGroupState, formGroupReducer, FormGroupState } from "ngrx-forms";
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

export const initialState: GlobalState = {
  orders: [],
  mostRecentOrder: null,
  orderForm: initialOrderFormState
};

export function reducer(
  state = initialState,
  action: any // normally this would be a union type of your action objects
): GlobalState {
  const orderForm = formGroupReducer(state.orderForm, action);
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
