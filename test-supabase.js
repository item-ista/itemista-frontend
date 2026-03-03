// Test Supabase connection
import { supabase } from './src/lib/supabase.js';

console.log('Testing Supabase connection...');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test basic connection
try {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful:', data);
  }
} catch (err) {
  console.error('Failed to connect to Supabase:', err);
}

// Test if we can reach Supabase
try {
  const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
    method: 'GET',
    headers: {
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    }
  });
  
  console.log('Raw Supabase API response status:', response.status);
  
  if (response.status === 200) {
    console.log('✅ Supabase API is reachable');
  } else {
    console.error('❌ Supabase API response:', response.status, response.statusText);
  }
} catch (err) {
  console.error('❌ Failed to reach Supabase API:', err);
}