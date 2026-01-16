import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button } from '../components/UIComponents';
import { QrCode, History, Star, User, MapPin, Wallet, Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Reward, VendorCustomer } from '../types';
import { INITIAL_REWARDS, INITIAL_CUSTOMERS } from '../mockData';

const CustomerPortal = () => {
  const { vendor, isDemo } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  // Fetch Rewards
  const { data: rewards } = useQuery({
      queryKey: ['rewards', vendor.id],
      queryFn: async () => {
          if (isDemo) return INITIAL_REWARDS;
          const { data } = await supabase.from('rewards').select('*').eq('vendor_id', vendor.id);
          return data || [];
      }
  });

  // Mock User
  const user = INITIAL_CUSTOMERS[0]; 

  return (
    <div className="min-h-screen bg-gray-100 pb-20 max-w-md mx-auto border-x border-gray-200 shadow-2xl overflow-hidden relative font-sans">
      
      {/* App Header */}
      <div className="bg-white p-4 pt-6 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-2">
              <div className="bg-brand-saffron p-1.5 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-extrabold text-xl tracking-tight text-gray-900">VendorVerse</h1>
          </div>
          <Bell className="w-6 h-6 text-gray-400" />
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        
        {/* Total Points Card */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Points Balance</p>
            <h2 className="text-4xl font-extrabold">1,240 <span className="text-lg text-gray-500 font-medium">pts</span></h2>
            <div className="mt-6 flex gap-3">
                 <button className="bg-brand-saffron text-white px-4 py-2 rounded-xl text-sm font-bold flex-1">Scan QR</button>
                 <button className="bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex-1">History</button>
            </div>
        </div>

        {/* Your Memberships */}
        <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Your Memberships</h3>
            <div className="space-y-3">
                
                {/* Active Card (Current Vendor) */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-brand-saffron text-xl">
                                {vendor.business_name?.charAt(0) || 'R'}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-900">{vendor.business_name || 'Raju Chai Wala'}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                    <MapPin className="w-3 h-3 mr-1" /> Dadar West
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="block text-2xl font-extrabold text-brand-saffron">{user.points_balance}</span>
                             <span className="text-[10px] text-gray-400 font-bold uppercase">Points</span>
                        </div>
                    </div>
                    
                    {/* Rewards Slider */}
                    <div className="mt-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Rewards available</p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {rewards?.map(r => (
                                <div key={r.id} className="min-w-[140px] bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-800 text-sm truncate">{r.name}</p>
                                    <p className="text-xs text-brand-saffron font-bold">{r.points_required} pts</p>
                                    <button className="mt-2 w-full bg-white border border-gray-200 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-50">Redeem</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other Mock Vendors */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-60 grayscale">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                S
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Shiv Vada Pav</h4>
                                <p className="text-xs text-gray-500">Kalyan</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-400">0 pts</span>
                    </div>
                </div>

            </div>
        </div>

      </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
            <button className="flex flex-col items-center p-1 text-brand-saffron">
                <Wallet className="w-6 h-6 fill-current" />
                <span className="text-[10px] font-bold mt-1">Wallet</span>
            </button>
            <button className="flex flex-col items-center p-1 text-gray-400">
                <QrCode className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">Scan</span>
            </button>
            <button className="flex flex-col items-center p-1 text-gray-400">
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">Profile</span>
            </button>
        </div>
    </div>
  );
};

export default CustomerPortal;