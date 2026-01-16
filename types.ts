export type Language = 'en' | 'hi';

export interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  upiId: string;
  businessType: 'food' | 'tea' | 'flowers' | 'vegetables' | 'other';
  pointsPer10Rupees: number;
  plan: 'free' | 'starter' | 'pro';
  minSpend?: number;
  tierSilver?: number;
  tierGold?: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
  redemptionCount: number;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalPoints: number;
  currentPoints: number;
  visits: number;
  lastVisit: string;
  tier: 'Bronze' | 'Silver' | 'Gold';
  totalSpent: number;
}

export interface Transaction {
  id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  amount: number;
  points: number;
  type: 'EARN' | 'REDEEM';
  date: string; // ISO string or formatted time for MVP
  paymentMethod?: 'PhonePe' | 'GPay' | 'Paytm';
}

export interface AnalyticsData {
  day: string;
  revenue: number;
  visits: number;
}