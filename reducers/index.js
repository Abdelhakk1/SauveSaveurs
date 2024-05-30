// src/reducers/index.js
import { combineReducers } from 'redux';
import storeReducer from './storeReducer';
import orderReducer from '../orderReducer';

export default combineReducers({
  store: storeReducer, // This will create a 'store' slice in your Redux state
  order: orderReducer  // This will create an 'order' slice in your Redux state
});
