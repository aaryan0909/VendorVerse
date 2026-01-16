import React, { useContext } from 'react';
import { 
  Users, IndianRupee, QrCode, TrendingUp, Zap, ChevronRight
} from 'lucide-react';
import { AppContext } from '../App';
import { Card, Button, Badge } from '../components/UIComponents';

const Dashboard = () => {
  const { customers, transactions, analyticsData, vendor, t, simulateTransaction } = useContext(AppContext);
  
  // Calculate Totals
  const todayRevenue = analyticsData[analyticsData.length-1].revenue;
  
  return (
    <div className="space-y-6">
      
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t('namaste')}, {vendor.ownerName.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 font-medium">{t('highSales')}</p>
        </div>
      </div>

      {/* Hero Card - Money */}
      <div className="bg-gradient-to-r from-brand-green to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-green-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-green-100 font-bold mb-1 uppercase tracking-wide text-xs">{t('todaysEarnings')}</p>
                <h2 className="text-5xl font-extrabold">₹{todayRevenue}</h2>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <IndianRupee className="w-6 h-6 text-white" />
            </div>
        </div>
        <div className="flex gap-2">
            <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-medium">
                {transactions.length} orders
            </div>
        </div>
      </div>

      {/* Quick Action - Simulate Payment (Demo Only) */}
      <button 
        onClick={simulateTransaction}
        className="w-full bg-brand-dark text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-transform"
      >
        <div className="flex items-center">
            <div className="bg-brand-yellow p-2 rounded-full mr-3 text-brand-dark">
                <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-lg">{t('simulatePay')}</span>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-l-4 border-brand-saffron bg-orange-50/50">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('totalCustomers')}</p>
            <p className="text-2xl font-extrabold text-brand-saffron">{customers.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-brand-yellow bg-yellow-50/50">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('weeklyVisits')}</p>
            <p className="text-2xl font-extrabold text-brand-yellow">142</p>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div>
        <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-extrabold text-gray-900 text-lg">{t('recentActivity')}</h3>
            <span className="text-brand-saffron text-sm font-bold">{t('viewAll')}</span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {transactions.slice(0, 5).map((tx, idx) => (
            <div key={tx.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length -1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${tx.type === 'EARN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {tx.customerName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{tx.customerName}</p>
                        <p className="text-xs text-gray-500 font-medium">
                            {tx.type === 'EARN' ? `Paid via ${tx.paymentMethod}` : `Redeemed Reward`}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                        <span className={`text-base font-extrabold ${tx.type === 'EARN' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'EARN' ? `+₹${tx.amount}` : 'FREE'}
                    </span>
                    <p className={`text-xs font-bold ${tx.type === 'EARN' ? 'text-brand-saffron' : 'text-gray-400'}`}>
                        {tx.type === 'EARN' ? `+${tx.points} pts` : '- pts'}
                    </p>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;