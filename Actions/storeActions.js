import { supabase } from '../database/supabaseClient';

export const CANCEL_RESERVATION = 'CANCEL_RESERVATION';
export const CONFIRM_PICKUP_RESERVATION = 'CONFIRM_PICKUP_RESERVATION';
export const FETCH_CURRENT_ORDERS = 'FETCH_CURRENT_ORDERS';
export const FETCH_HISTORY_ORDERS = 'FETCH_HISTORY_ORDERS';
export const ADD_TO_CURRENT_ORDERS = 'ADD_TO_CURRENT_ORDERS';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const CLEAR_ORDER_HISTORY = 'CLEAR_ORDER_HISTORY';
export const UPDATE_QUANTITY_LEFT = 'UPDATE_QUANTITY_LEFT';
export const FETCH_SURPRISE_BAGS = 'FETCH_SURPRISE_BAGS';
export const CLEAR_COMPLETED_RESERVATIONS = 'CLEAR_COMPLETED_RESERVATIONS';
export const FETCH_USER_INFO = 'FETCH_USER_INFO';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const SET_NEARBY_SHOPS = 'SET_NEARBY_SHOPS';
export const FETCH_SHOP_DETAILS = 'FETCH_SHOP_DETAILS';
export const CLEAR_SHOP_DETAILS = 'CLEAR_SHOP_DETAILS';

export const fetchUserInfo = (userId, userType) => async (dispatch) => {
  try {
    const table = userType === 'employee' ? 'employees' : 'clients';
    const { data, error } = await supabase
      .from(table)
      .select('id, full_name, profile_pic_url')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data || error?.code === 'PGRST116') {
      return;
    }

    dispatch({
      type: FETCH_USER_INFO,
      payload: data,
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

export const fetchShopDetails = (userId) => async (dispatch) => {
  try {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('id, shop_name, shop_address, shop_image_url, status')
      .eq('employee_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (shop) {
      dispatch({
        type: FETCH_SHOP_DETAILS,
        payload: shop,
      });
    } else {
      dispatch({
        type: CLEAR_SHOP_DETAILS,
      });
    }
  } catch (error) {
    console.error('Error fetching shop details:', error);
  }
};

export const addNotification = (userId, message, userType) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id: userId, message, user_type: userType }])
      .select();

    if (error) throw error;

    dispatch({
      type: ADD_NOTIFICATION,
      payload: { user_id: userId, message, created_at: new Date().toISOString(), user_type: userType },
    });
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

export const fetchNotifications = (userId, userType) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .order('created_at', { ascending: false });

    if (error) throw error;

    dispatch({
      type: FETCH_NOTIFICATIONS,
      payload: { data, userType },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

export const clearNotifications = (userId, userType) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('user_type', userType);

    if (error) throw error;

    dispatch({
      type: CLEAR_NOTIFICATIONS,
      payload: { userId, userType },
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

export const addToCurrentOrders = (order) => ({
  type: ADD_TO_CURRENT_ORDERS,
  payload: order,
});

export const createOrder = (order, userId, employeeId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .insert([order])
      .select();

    if (error) throw error;

    dispatch(addNotification(userId, 'Your reservation was created successfully.', 'client'));
    if (employeeId) {
      dispatch(addNotification(employeeId, 'You have a new reservation.', 'employee'));
    }
  } catch (error) {
    console.error('Error creating order:', error);
  }
};


export const updateOrderStatus = (orderId, userId, status) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('order_id', orderId);

    if (error) throw error;

    dispatch(fetchCurrentOrders(userId));
    dispatch(fetchHistoryOrders(userId));
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

export const fetchCurrentOrders = (userId) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'Cancelled by store')
      .neq('status', 'Cancelled by client')
      .neq('status', 'Picked up');

    if (error) throw error;

    dispatch({
      type: FETCH_CURRENT_ORDERS,
      payload: data,
    });
  } catch (error) {
    console.error('Error fetching current orders:', error);
  }
};

export const fetchHistoryOrders = (userId) => async (dispatch) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .or('status.eq.Cancelled by store,status.eq.Cancelled by client,status.eq.Picked up');

    if (error) throw error;

    dispatch({
      type: FETCH_HISTORY_ORDERS,
      payload: data,
    });
  } catch (error) {
    console.error('Error fetching history orders:', error);
  }
};

export const addToFavorites = (item) => ({
  type: ADD_TO_FAVORITES,
  payload: item,
});

export const removeFromFavorites = (itemId) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: itemId,
});

export const updateUserInfo = (userInfo) => ({
  type: UPDATE_USER_INFO,
  payload: userInfo,
});

export const clearOrderHistory = (userId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('user_id', userId)
      .or('status.eq.Cancelled by store,status.eq.Cancelled by client,status.eq.Picked up');

    if (error) throw error;

    dispatch({
      type: CLEAR_ORDER_HISTORY,
      payload: userId,
    });
  } catch (error) {
    console.error('Error clearing order history:', error);
  }
};

export const updateQuantityLeft = (bagId, newQuantity) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('surprise_bags')
      .update({ quantity_left: newQuantity })
      .eq('id', bagId);

    if (error) throw error;

    dispatch({
      type: UPDATE_QUANTITY_LEFT,
      payload: { bagId, newQuantity },
    });
  } catch (error) {
    console.error('Error updating quantity left:', error);
  }
};

export const fetchSurpriseBags = (bags) => ({
  type: FETCH_SURPRISE_BAGS,
  payload: bags,
});

export const clearCompletedReservations = (userId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .or('status.eq.Cancelled by store,status.eq.Cancelled by client,status.eq.Picked up');

    if (error) throw error;

    dispatch(fetchCurrentOrders(userId));
    dispatch(fetchHistoryOrders(userId));
  } catch (error) {
    console.error('Error clearing completed reservations:', error);
  }
};

export const cancelReservationByClient = (orderId, userId) => async (dispatch, getState) => {
  if (!userId) {
    console.error('Invalid user ID');
    return;
  }

  try {
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError) throw fetchError;

    const { surprise_bag_id, quantity, employee_id } = reservation;

    const { error: updateError } = await supabase
      .from('reservations')
      .update({ status: 'Cancelled by client' })
      .eq('order_id', orderId);

    if (updateError) throw updateError;

    dispatch(addNotification(userId, 'Your reservation was cancelled.', 'client'));

    if (employee_id) {
      dispatch(addNotification(employee_id, 'A reservation has been cancelled by the client.', 'employee'));
    }

    const bag = getState().store.surpriseBags.find(bag => bag.id === surprise_bag_id);
    if (bag) {
      const newQuantity = (bag.quantity_left || 0) + (quantity || 1);
      dispatch(updateQuantityLeft(surprise_bag_id, newQuantity));
    }

    dispatch(fetchCurrentOrders(userId));
    dispatch(fetchHistoryOrders(userId));
  } catch (error) {
    console.error('Error canceling reservation:', error);
  }
};

export const cancelReservationByEmployee = (orderId, userId, clientId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'Cancelled by store' })
      .eq('order_id', orderId);

    if (error) throw error;

    // Add notification for client
    dispatch(addNotification(clientId, 'Your reservation was cancelled by the store.', 'client'));

    dispatch(fetchCurrentOrders(userId));
    dispatch(fetchHistoryOrders(userId));
  } catch (error) {
    console.error('Error cancelling reservation by store:', error);
  }
};

export const confirmPickupReservation = (orderId, userId, clientId) => async (dispatch) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'Picked up' })
      .eq('order_id', orderId);

    if (error) throw error;

    // Add notification for client
    dispatch(addNotification(clientId, 'Your reservation has been picked up.', 'client'));

    dispatch(fetchCurrentOrders(userId));
    dispatch(fetchHistoryOrders(userId));
  } catch (error) {
    console.error('Error confirming pickup reservation:', error);
  }
};

export const setNearbyShops = (shops) => ({
  type: SET_NEARBY_SHOPS,
  payload: shops,
});

export const fetchShopsWithinDistance = (latitude, longitude, distance) => async (dispatch) => {
  try {
    const { data: shops, error } = await supabase.rpc('get_shops_within_distance', {
      user_lat: latitude,
      user_lon: longitude,
      distance_km: distance
    });

    if (error) throw error;

    dispatch({
      type: SET_NEARBY_SHOPS,
      payload: shops,
    });
  } catch (error) {
    console.error('Error fetching shops within distance:', error);
    throw error;
  }
};

export const fetchShopsWithinRadius = (latitude, longitude, radius) => async (dispatch) => {
  try {
    const { data, error } = await supabase.rpc('get_shops_within_radius', {
      lat: latitude,
      long: longitude,
      rad: radius,
    });

    if (error) throw error;

    const formattedShops = data.map((shop) => ({
      ...shop,
      bag_id: shop.id, // Ensure bag_id is included
      shop_id: shop.shop_id,
    }));

    dispatch(setNearbyShops(formattedShops));
  } catch (error) {
    console.error('Error fetching shops within radius:', error);
    throw error;
  }
};
