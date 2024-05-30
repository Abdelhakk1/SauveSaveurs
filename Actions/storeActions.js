// actions/storeActions.js

// Action Types
export const UPDATE_STORE_DETAILS = 'UPDATE_STORE_DETAILS';
export const RESERVE_BAG = 'RESERVE_BAG';
export const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const MOVE_ORDER_TO_HISTORY = 'MOVE_ORDER_TO_HISTORY';
export const CLEAR_ORDER_HISTORY = 'CLEAR_ORDER_HISTORY';

// Action Creators

// Updates the store details
export const setStoreDetails = (storeDetails) => ({
  type: UPDATE_STORE_DETAILS,
  payload: storeDetails,
});

// Action creator for reserving a bag
export const reserveBag = (reservationDetails) => ({
  type: RESERVE_BAG,
  payload: reservationDetails,
});

// Action creator for canceling a reservation
export const cancelReservation = (reservationId) => ({
  type: CANCEL_RESERVATION,
  payload: reservationId,
});

// Action creator for adding a store to favorites
export const addToFavorites = (store) => ({
  type: ADD_TO_FAVORITES,
  payload: store,
});

// Action creator for removing a store from favorites
export const removeFromFavorites = (storeId) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: storeId,
});

// Action creator for moving an order to history
export const moveOrderToHistory = (orderId) => ({
  type: MOVE_ORDER_TO_HISTORY,
  payload: orderId,
});

// Action creator for clearing the order history
export const clearOrderHistory = () => ({
  type: CLEAR_ORDER_HISTORY,
});
