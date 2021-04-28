import { Order } from "../order/order.service";
import { ActionType } from "./actions";

// obviously incomplete, just for this example
export type GlobalState = {
  orders: Array<Order>
  mostRecentOrder?: Order;
}

export const initialState: GlobalState = {
  orders: [],
  mostRecentOrder: null
};

export function reducer(
  state = initialState,
  action: any // normally this would be a union type of your action objects
): GlobalState {
  switch (action.type) {
    case ActionType.createOrderSuccess:
      const orders = [...state.orders, action.order];
      return {...state, orders, mostRecentOrder: action.order};
    default:
      return state;
  }
}
