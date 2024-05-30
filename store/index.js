import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers'; // The file where you combine all your reducers

const store = configureStore({
  reducer: rootReducer
});

export default store;
