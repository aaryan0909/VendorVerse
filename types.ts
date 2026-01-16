
export type Language = 'en' | 'hi';

export interface Vendor {
  id: string; // UUID from auth.users
  phone: string;
  business_name: string;
  owner_name: string;
  business_type: 'food' | 'tea' | 'flowers' | 'vegetables' | 'other';
  upi_id: string;
  points_per_10_rupees: number;
  plan: 'free' | 'starter' | 'pro';
  created_at?: string;
  // Added fields
  min_spend?: number;
  tier_silver?: number;
  tier_gold?: number;
}

export interface Customer {
  id: string; // UUID
  phone: string;
  name: string | null;
  created_at?: string;
}

export interface VendorCustomer {
  id: string;
  vendor_id: string;
  customer_id: string;
  points_balance: number;
  total_spent: number;
  visit_count: number;
  last_visit: string;
  tier: 'bronze' | 'silver' | 'gold';
  // Joined fields
  customers?: Customer; 
}

export interface Reward {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  points_required: number;
  is_active: boolean;
  redemption_count: number;
  image?: string;
}

export interface Transaction {
  id: string;
  vendor_id: string;
  customer_id: string;
  amount: number;
  points_earned: number;
  type: 'EARN' | 'REDEEM';
  payment_method: 'phonepe' | 'gpay' | 'paytm' | 'cash';
  created_at: string;
  // Joined fields
  customers?: {
    name: string;
    phone: string;
  };
}

export interface AnalyticsData {
  date: string;
  revenue: number;
  visits: number;
}
