import React, { useContext, useState } from 'react';
import { IndianRupee, TrendingUp, Zap, ChevronRight, Info, X } from 'lucide-react';
import { AppContext } from '../App';
import { Card } from '../components/UIComponents';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { INITIAL_TRANSACTIONS } from '../mockData';

const Dashboard = () => {
  const { vendor, t, isDemo } = useContext(AppContext);
  const navigate = useNavigate();
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Fetch Stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['vendorStats', vendor?.id],
    queryFn: async () => {
        if (isDemo) {
            // Mock Data for Demo
            return { revenue: 2450, count: 12, customerCount: 45 };
        }

        const today = new Date().toISOString().split('T')[0];
        
        const { data: todayTxns } = await supabase
            .from('transactions')
            .select('amount')
            .eq('vendor_id', vendor.id)
            .gte('created_at', today);
        
        const revenue = todayTxns?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
        const count = todayTxns?.length || 0;

        const { count: customerCount } = await supabase
            .from('vendor_customers')
            .select('*', { count: 'exact', head: true })
            .eq('vendor_id', vendor.id);

        return { revenue, count, customerCount: customerCount || 0 };
    },
    enabled: !!vendor?.id
  });

  // Fetch Recent Transactions
  const { data: recentTxns } = useQuery({
      queryKey: ['recentTxns', vendor?.id],
      queryFn: async () => {
          if (isDemo) {
            return INITIAL_TRANSACTIONS;
          }
          const { data } = await supabase
            .from('transactions')
            .select('*, customers(name, phone)')
            .eq('vendor_id', vendor.id)
            .order('created_at', { ascending: false })
            .limit(5);
          return data || [];
      },
      enabled: !!vendor?.id
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t('namaste')}, {vendor?.owner_name?.split(' ')[0] || 'Partner'} 👋</h1>
            <p className="text-gray-500 font-medium">{t('highSales')}</p>
        </div>
      </div>

      {isDemo && showDemoBanner && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-blue-800">Preview Mode Active</p>
                    <p className="text-xs text-blue-700">
                        You are viewing a simulation. Data is not saved to the database.
                    </p>
                </div>
              </div>
              <button onClick={() => setShowDemoBanner(false)} className="text-blue-400 hover:text-blue-600">
                  <X className="w-4 h-4" />
              </button>
          </div>
      )}

      {/* Hero Card - Money */}
      <div className="bg-gradient-to-r from-brand-green to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-green-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-green-100 font-bold mb-1 uppercase tracking-wide text-xs">{t('todaysEarnings')}</p>
                <h2 className="text-5xl font-extrabold">₹{stats?.revenue}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <IndianRupee className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="flex gap-2">
            <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> Today
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-medium">
                {stats?.count} orders
            </div>
        </div>
      </div>

      {/* Quick Action */}
      <button 
        onClick={() => navigate('/vendor/simulate')}
        className="w-full bg-brand-dark text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-transform"
      >
        <div className="flex items-center">
            <div className="bg-brand-yellow p-2 rounded-full mr-3 text-brand-dark">
                <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="text-left">
                <span className="font-bold text-lg block">{t('simulatePay')}</span>
                <span className="text-xs text-gray-400 font-medium">Simulate Customer Payment</span>
            </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-l-4 border-brand-saffron bg-orange-50/50">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('totalCustomers')}</p>
            <p className="text-2xl font-extrabold text-brand-saffron">{stats?.customerCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-brand-yellow bg-yellow-50/50">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('weeklyVisits')}</p>
            <p className="text-2xl font-extrabold text-brand-yellow">84</p>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-extrabold text-gray-900 text-lg">{t('recentActivity')}</h3>
            <span className="text-brand-saffron text-sm font-bold">{t('viewAll')}</span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {recentTxns?.map((tx, idx) => {
                const custName = tx.customers?.name || tx.customers?.phone || 'Guest';
                return (
                <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== recentTxns.length -1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${tx.type === 'EARN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {custName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{custName}</p>
                            <p className="text-xs text-gray-500 font-medium">
                                {tx.created_at.includes('T') ? new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : tx.created_at}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                            <span className={`text-base font-extrabold ${tx.type === 'EARN' ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.type === 'EARN' ? `+₹${tx.amount}` : 'FREE'}
                        </span>
                        <p className={`text-xs font-bold ${tx.type === 'EARN' ? 'text-brand-saffron' : 'text-gray-400'}`}>
                            {tx.type === 'EARN' ? `+${tx.points_earned} pts` : '- pts'}
                        </p>
                    </div>
                </div>
                )
            })}
            {(!recentTxns || recentTxns.length === 0) && (
                <div className="p-4 text-center text-gray-500 text-sm">No transactions yet.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;