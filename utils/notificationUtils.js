import { supabase } from '../database/supabaseClient';

export const createNotification = async (userId, message) => {
  const { error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, message }]);

  if (error) {
    console.error('Error creating notification:', error);
  }
};

export const fetchNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data;
};
