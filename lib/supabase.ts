import { createClient } from '@supabase/supabase-js';

// Fallback for development if env vars are missing to prevent crash, 
// but functionalit will fail until configured.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getVendorId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};