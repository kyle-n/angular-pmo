import { Order } from "../order/order.service";
import { ActionType } from "./actions";

// obviously incomplete, just for this example
export type GlobalState = {
  orders: Array<Order>
}

export const initialState: GlobalState = {
  orders: []
};

export function reducer(
  state = initialState,
  action: any // normally this would be a union type of your action objects
): GlobalState {
  switch (action.type) {
    case ActionType.createOrderSuccess:
      const orders = [...state.orders, action.order];
      return {...state, orders};
    default:
      return state;
  }
}
