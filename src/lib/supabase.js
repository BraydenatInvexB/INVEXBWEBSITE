import { createClient } from '@supabase/supabase-js';

// Support both VITE_ (for Vite) and NEXT_PUBLIC_ (for Next.js) prefixes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('Current values:', {
    url: supabaseUrl ? '✓ Set' : '✗ Missing',
    key: supabaseAnonKey ? '✓ Set' : '✗ Missing'
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Test connection on load (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase client initialized:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValid: supabaseUrl && supabaseUrl.includes('supabase.co')
  });
  
  // Test a simple query to verify connection
  supabase.from('promotion_settings').select('id').limit(1)
    .then(({ error }) => {
      if (error) {
        console.error('Supabase connection test failed:', error);
      } else {
        console.log('✓ Supabase connection successful');
      }
    });
}

