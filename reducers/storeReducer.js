// reducers/storeReducer.js

import {
  UPDATE_STORE_DETAILS,
  RESERVE_BAG,
  CANCEL_RESERVATION,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  MOVE_ORDER_TO_HISTORY,
  CLEAR_ORDER_HISTORY,
} from '../Actions/storeActions';

const initialState = {
  currentStore: {},
  currentOrders: [],
  historyOrders: [],
  favorites: [],
  currentReservation: null,
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_STORE_DETAILS:
      return {
        ...state,
        currentStore: action.payload,
      };
    case RESERVE_BAG:
      return {
        ...state,
        currentOrders: [...state.currentOrders, action.payload],
        currentReservation: action.payload,
      };
    case CANCEL_RESERVATION: {
      const order = state.currentOrders.find(order => order.id === action.payload);
      return {
        ...state,
        currentOrders: state.currentOrders.filter(order => order.id !== action.payload),
        historyOrders: [...state.historyOrders, { ...order, status: 'Canceled' }],
        currentReservation: null,
      };
    }
    case ADD_TO_FAVORITES:
      if (state.favorites.some(favorite => favorite.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(favorite => favorite.id !== action.payload),
      };
    case MOVE_ORDER_TO_HISTORY: {
      const order = state.currentOrders.find(order => order.id === action.payload);
      return {
        ...state,
        currentOrders: state.currentOrders.filter(order => order.id !== action.payload),
        historyOrders: [...state.historyOrders, order],
      };
    }
    case CLEAR_ORDER_HISTORY:
      return {
        ...state,
        historyOrders: [],
      };
    default:
      return state;
  }
};

export default storeReducer;
