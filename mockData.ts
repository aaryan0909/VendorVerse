import { Vendor, Customer, Reward, Transaction, AnalyticsData } from './types';

export const CURRENT_VENDOR: Vendor = {
  id: 'v1',
  businessName: "Raju Chai Wala",
  ownerName: "Raju Kumar",
  phone: "+91 98765 43210",
  upiId: "raju.chai@paytm",
  businessType: 'tea',
  pointsPer10Rupees: 1, // 1 point for every ₹10
  plan: 'free'
};

export const INITIAL_REWARDS: Reward[] = [
  { 
    id: 'r1', 
    name: 'Free Masala Chai', 
    description: 'One hot cup of special masala tea', 
    pointsRequired: 50, 
    isActive: true,
    redemptionCount: 23 
  },
  { 
    id: 'r2', 
    name: 'Bun Maska Free', 
    description: 'Fresh bun with Amul butter', 
    pointsRequired: 80, 
    isActive: true,
    redemptionCount: 12 
  },
  { 
    id: 'r3', 
    name: 'Special Vada Pav', 
    description: 'Mumbai style spicy vada pav', 
    pointsRequired: 100, 
    isActive: true,
    redemptionCount: 5 
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { 
    id: 'c1', 
    name: 'Amit Singh', 
    phone: '9876543210', 
    totalPoints: 150, 
    currentPoints: 45, 
    visits: 12, 
    lastVisit: '2 mins ago', 
    tier: 'Silver',
    totalSpent: 650
  },
  { 
    id: 'c2', 
    name: 'Priya Sharma', 
    phone: '9123456789', 
    totalPoints: 320, 
    currentPoints: 120, 
    visits: 28, 
    lastVisit: '1 hour ago', 
    tier: 'Gold',
    totalSpent: 1400
  },
  { 
    id: 'c3', 
    name: 'Rahul Verma', 
    phone: '9988776655', 
    totalPoints: 20, 
    currentPoints: 20, 
    visits: 2, 
    lastVisit: 'Yesterday', 
    tier: 'Bronze',
    totalSpent: 40
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', vendorId: 'v1', customerId: 'c1', customerName: 'Amit Singh', amount: 20, points: 2, type: 'EARN', date: 'Just now', paymentMethod: 'PhonePe' },
  { id: 't2', vendorId: 'v1', customerId: 'c2', customerName: 'Priya Sharma', amount: 0, points: -50, type: 'REDEEM', date: '1 hour ago' },
  { id: 't3', vendorId: 'v1', customerId: 'c3', customerName: 'Rahul Verma', amount: 50, points: 5, type: 'EARN', date: '2 hours ago', paymentMethod: 'GPay' },
  { id: 't4', vendorId: 'v1', customerId: 'c2', customerName: 'Priya Sharma', amount: 40, points: 4, type: 'EARN', date: 'Yesterday', paymentMethod: 'Paytm' },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { day: 'Mon', revenue: 1200, visits: 45 },
  { day: 'Tue', revenue: 950, visits: 38 },
  { day: 'Wed', revenue: 1400, visits: 52 },
  { day: 'Thu', revenue: 1100, visits: 40 },
  { day: 'Fri', revenue: 1800, visits: 65 },
  { day: 'Sat', revenue: 2200, visits: 80 },
  { day: 'Sun', revenue: 2500, visits: 95 },
];
