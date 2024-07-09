import { combineReducers } from 'redux';
import storeReducer from './storeReducer';

const rootReducer = combineReducers({
  store: storeReducer,
});

export default rootReducer;
