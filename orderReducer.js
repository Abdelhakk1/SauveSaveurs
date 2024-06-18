const initialState = {
  orders: [],
  loading: false,
  error: null
};

function orderReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    case 'FETCH_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: false
      };
    case 'LOADING_ORDERS':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}

export default orderReducer;
