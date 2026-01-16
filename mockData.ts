
import { Vendor, Customer, Reward, Transaction, AnalyticsData, VendorCustomer } from './types';

export const CURRENT_VENDOR: Vendor = {
  id: 'v1',
  business_name: "Raju Chai Wala",
  owner_name: "Raju Kumar",
  phone: "+91 98765 43210",
  upi_id: "raju.chai@paytm",
  business_type: 'tea',
  points_per_10_rupees: 1, // 1 point for every ₹10
  plan: 'free',
  min_spend: 0,
  tier_silver: 500,
  tier_gold: 1000
};

export const INITIAL_REWARDS: Reward[] = [
  { 
    id: 'r1', 
    vendor_id: 'v1',
    name: 'Free Masala Chai', 
    description: 'One hot cup of special masala tea', 
    points_required: 50, 
    is_active: true,
    redemption_count: 23 
  },
  { 
    id: 'r2', 
    vendor_id: 'v1',
    name: 'Bun Maska Free', 
    description: 'Fresh bun with Amul butter', 
    points_required: 80, 
    is_active: true,
    redemption_count: 12 
  },
  { 
    id: 'r3', 
    vendor_id: 'v1',
    name: 'Special Vada Pav', 
    description: 'Mumbai style spicy vada pav', 
    points_required: 100, 
    is_active: true,
    redemption_count: 5 
  }
];

export const INITIAL_CUSTOMERS: VendorCustomer[] = [
  { 
    id: 'vc1', 
    vendor_id: 'v1',
    customer_id: 'c1',
    points_balance: 45, 
    visit_count: 12, 
    last_visit: '2 mins ago', 
    tier: 'silver',
    total_spent: 650,
    customers: {
        id: 'c1',
        name: 'Amit Singh',
        phone: '9876543210'
    }
  },
  { 
    id: 'vc2', 
    vendor_id: 'v1',
    customer_id: 'c2',
    points_balance: 120, 
    visit_count: 28, 
    last_visit: '1 hour ago', 
    tier: 'gold',
    total_spent: 1400,
    customers: {
        id: 'c2',
        name: 'Priya Sharma',
        phone: '9123456789'
    }
  },
  { 
    id: 'vc3', 
    vendor_id: 'v1',
    customer_id: 'c3',
    points_balance: 20, 
    visit_count: 2, 
    last_visit: 'Yesterday', 
    tier: 'bronze',
    total_spent: 40,
    customers: {
        id: 'c3',
        name: 'Rahul Verma',
        phone: '9988776655'
    }
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', vendor_id: 'v1', customer_id: 'c1', customers: { name: 'Amit Singh', phone: '9876543210' }, amount: 20, points_earned: 2, type: 'EARN', created_at: 'Just now', payment_method: 'phonepe' },
  { id: 't2', vendor_id: 'v1', customer_id: 'c2', customers: { name: 'Priya Sharma', phone: '9123456789' }, amount: 0, points_earned: -50, type: 'REDEEM', created_at: '1 hour ago', payment_method: 'cash' },
  { id: 't3', vendor_id: 'v1', customer_id: 'c3', customers: { name: 'Rahul Verma', phone: '9988776655' }, amount: 50, points_earned: 5, type: 'EARN', created_at: '2 hours ago', payment_method: 'gpay' },
  { id: 't4', vendor_id: 'v1', customer_id: 'c2', customers: { name: 'Priya Sharma', phone: '9123456789' }, amount: 40, points_earned: 4, type: 'EARN', created_at: 'Yesterday', payment_method: 'paytm' },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { date: 'Mon', revenue: 1200, visits: 45 },
  { date: 'Tue', revenue: 950, visits: 38 },
  { date: 'Wed', revenue: 1400, visits: 52 },
  { date: 'Thu', revenue: 1100, visits: 40 },
  { date: 'Fri', revenue: 1800, visits: 65 },
  { date: 'Sat', revenue: 2200, visits: 80 },
  { date: 'Sun', revenue: 2500, visits: 95 },
];
