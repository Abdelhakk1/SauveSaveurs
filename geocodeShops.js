const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://rboyqdyoehiiajuvcyft.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib3lxZHlvZWhpaWFqdXZjeWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODIsImV4cCI6MjAzMjIyOTk4Mn0.mBAq6q-QTOowr8MIpZxWBBUJy_uDBF6zK2ebqbAzCHQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to geocode an address using OpenStreetMap's Nominatim API
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
      };
    } else {
      console.log(`No results found for address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Function to update shops with geocoded coordinates
const updateShopsWithCoordinates = async () => {
  // Fetch all shops from the Supabase table
  const { data: shops, error } = await supabase.from('shops').select('*');

  if (error) {
    console.error('Error fetching shops:', error);
    return;
  }

  for (const shop of shops) {
    if (!shop.latitude || !shop.longitude) {
      console.log(`Geocoding address for shop: ${shop.shop_name}`);
      const coordinates = await geocodeAddress(shop.shop_address);

      if (coordinates) {
        const { latitude, longitude } = coordinates;
        const { error } = await supabase
          .from('shops')
          .update({ latitude, longitude })
          .eq('id', shop.id);

        if (error) {
          console.error('Error updating shop coordinates:', error);
        } else {
          console.log(`Updated coordinates for shop: ${shop.shop_name}`);
        }
      }
    }
  }

  console.log('Geocoding and update completed.');
};

// Run the update function
updateShopsWithCoordinates();
