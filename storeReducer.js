import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  UPDATE_USER_INFO,
  CANCEL_RESERVATION,
  CONFIRM_PICKUP_RESERVATION,
  FETCH_CURRENT_ORDERS,
  FETCH_HISTORY_ORDERS,
  CLEAR_ORDER_HISTORY,
  ADD_TO_CURRENT_ORDERS,
  UPDATE_QUANTITY_LEFT,
  FETCH_SURPRISE_BAGS,
  FETCH_USER_INFO,
  ADD_NOTIFICATION,
  FETCH_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  SET_NEARBY_SHOPS,
  FETCH_SHOP_DETAILS,
  CLEAR_SHOP_DETAILS,
} from '../Actions/storeActions';

const initialState = {
  favorites: [],
  userInfo: {},
  currentOrders: [],
  historyOrders: [],
  surpriseBags: [],
  clientNotifications: [],
  employeeNotifications: [],
  nearbyShops: [],
  shopDetails: null,
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAVORITES:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };
    case UPDATE_USER_INFO:
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload },
      };
    case FETCH_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    case FETCH_SHOP_DETAILS:
      return {
        ...state,
        shopDetails: action.payload,
      };
    case CLEAR_SHOP_DETAILS:
      return {
        ...state,
        shopDetails: null,
      };
    case FETCH_CURRENT_ORDERS:
      return {
        ...state,
        currentOrders: action.payload,
      };
    case FETCH_HISTORY_ORDERS:
      return {
        ...state,
        historyOrders: action.payload,
      };
    case ADD_TO_CURRENT_ORDERS:
      return {
        ...state,
        currentOrders: [...state.currentOrders, action.payload],
      };
    case CANCEL_RESERVATION: {
      const updatedCurrentOrders = state.currentOrders.filter(
        (order) => order.id !== action.payload.reservationId
      );
      const cancelledOrder = state.currentOrders.find((order) => order.id === action.payload.reservationId);
      if (cancelledOrder) {
        const updatedCancelledOrder = { ...cancelledOrder, status: action.payload.status };
        return {
          ...state,
          currentOrders: updatedCurrentOrders,
          historyOrders: [...state.historyOrders, updatedCancelledOrder],
        };
      }
      return {
        ...state,
        currentOrders: updatedCurrentOrders,
      };
    }
    case CONFIRM_PICKUP_RESERVATION: {
      const updatedCurrentOrders = state.currentOrders.filter(
        (order) => order.id !== action.payload.reservationId
      );
      const pickedUpOrder = state.currentOrders.find((order) => order.id === action.payload.reservationId);
      if (pickedUpOrder) {
        const updatedPickedUpOrder = { ...pickedUpOrder, status: action.payload.status };
        return {
          ...state,
          currentOrders: updatedCurrentOrders,
          historyOrders: [...state.historyOrders, updatedPickedUpOrder],
        };
      }
      return {
        ...state,
        currentOrders: updatedCurrentOrders,
      };
    }
    case CLEAR_ORDER_HISTORY:
      return {
        ...state,
        historyOrders: [],
      };
    case UPDATE_QUANTITY_LEFT: {
      const updatedSurpriseBags = state.surpriseBags.map(bag => {
        if (bag.id === action.payload.bagId) {
          return { ...bag, quantity_left: action.payload.newQuantity };
        }
        return bag;
      });
      return {
        ...state,
        surpriseBags: updatedSurpriseBags,
      };
    }
    case FETCH_SURPRISE_BAGS:
      return {
        ...state,
        surpriseBags: action.payload,
      };
    case ADD_NOTIFICATION: {
      const notificationsKey = action.payload.user_type === 'client' ? 'clientNotifications' : 'employeeNotifications';
      return {
        ...state,
        [notificationsKey]: [action.payload, ...state[notificationsKey]],
      };
    }
    case FETCH_NOTIFICATIONS: {
      const notificationsKey = action.payload.userType === 'client' ? 'clientNotifications' : 'employeeNotifications';
      return {
        ...state,
        [notificationsKey]: action.payload.data,
      };
    }
    case CLEAR_NOTIFICATIONS: {
      const notificationsKey = action.payload.userType === 'client' ? 'clientNotifications' : 'employeeNotifications';
      return {
        ...state,
        [notificationsKey]: [],
      };
    }
    case SET_NEARBY_SHOPS:
      return {
        ...state,
        nearbyShops: action.payload,
      };
    default:
      return state;
  }
};

export default storeReducer;
