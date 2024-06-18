import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rboyqdyoehiiajuvcyft.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib3lxZHlvZWhpaWFqdXZjeWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODIsImV4cCI6MjAzMjIyOTk4Mn0.mBAq6q-QTOowr8MIpZxWBBUJy_uDBF6zK2ebqbAzCHQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    enabled: true,
  },
});
