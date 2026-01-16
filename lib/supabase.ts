import { createClient } from '@supabase/supabase-js';

/**
 * ARCHITECTURE NOTE:
 * This application uses a SINGLE-TENANT DATABASE architecture.
 */

// 1. Configuration
const HARDCODED_URL = 'https://veypwpdphwkkrryqrzhp.supabase.co'; 
// Note: The key below provided by user is a UUID, not a JWT. It will fail. 
// We are clearing it to force the app to check validation logic.
const HARDCODED_KEY = ''; 

// Helper to validate configuration
const isConfigValid = (url: string | undefined, key: string | undefined) => {
    // STRICT VALIDATION: Supabase API keys (JWTs) MUST start with 'ey'.
    // If a user provides a UUID (e.g. 4fa6...), Supabase will reject it with "Invalid API Key".
    // We return false here to force Demo Mode and prevent the crash.
    return url && key && key.startsWith('ey') && key.length > 20;
};

// 2. Determine Credentials
const envUrl = process.env.REACT_APP_SUPABASE_URL || localStorage.getItem('supabase_url') || HARDCODED_URL;
const envKey = process.env.REACT_APP_SUPABASE_ANON_KEY || localStorage.getItem('supabase_key') || HARDCODED_KEY;

// 3. Status Check
// If this is false, App.tsx will set isDemo = true
const isReady = isConfigValid(envUrl, envKey);

// 4. Initialize Client
let client;

try {
    // Only use the credentials if they are valid. Otherwise use placeholder to avoid console errors.
    const safeUrl = isReady ? envUrl : 'https://placeholder.supabase.co';
    const safeKey = isReady ? envKey : 'placeholder';
    
    // @ts-ignore
    client = createClient(safeUrl, safeKey);
    
    if (isReady) {
        console.log('✅ Connected to Single Global Database');
    } else {
        console.log('⚠️ Configuration invalid (Key must be a JWT starting with "ey"). Running in DEMO MODE.');
    }
} catch (error) {
    client = createClient('https://placeholder.supabase.co', 'placeholder');
}

export const supabase = client;

export const isConfigured = () => isReady;

export const getVendorId = async () => {
  if (!isConfigured()) return 'mock-vendor-id';
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  } catch (e) {
      return 'mock-vendor-id';
  }
};

export const resetConnection = () => {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_key');
    window.location.reload();
};