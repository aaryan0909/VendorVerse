import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button, Badge } from '../components/UIComponents';
import { QrCode, History, Star, ArrowRight, User, MapPin } from 'lucide-react';

const CustomerPortal = () => {
  const { customers, rewards, vendor } = useContext(AppContext);
  // Simulating logged in user (Amit Singh - c1)
  const user = customers[0]; 
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto border-x border-gray-200 shadow-2xl overflow-hidden relative font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-saffron to-orange-600 text-white p-6 rounded-b-[2.5rem] shadow-xl relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold opacity-90">{vendor.businessName}</h2>
            <div className="flex items-center text-xs opacity-75 mt-1">
                <MapPin className="w-3 h-3 mr-1" /> Dadar Station, Mumbai
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">
             {user.phone}
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-sm opacity-80 mb-1 font-medium">YOUR BALANCE</p>
          <h1 className="text-6xl font-bold tracking-tight drop-shadow-sm">{user.currentPoints}</h1>
          <p className="text-sm font-medium mt-1 opacity-90">Points</p>
        </div>

        {/* Tier Progress */}
        <div className="mt-6">
            <div className="flex justify-between text-xs mb-2 opacity-90 font-medium">
                <span>Silver</span>
                <span>Gold (500 pts)</span>
            </div>
            <div className="bg-black/20 rounded-full h-2 w-full overflow-hidden backdrop-blur-sm">
                <div className="bg-brand-yellow h-full rounded-full shadow-[0_0_10px_rgba(255,193,7,0.5)]" style={{ width: '45%' }}></div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-5 space-y-6 -mt-4 relative z-20">
        
        {/* Quick Scan */}
        <Card className="p-4 bg-white border-none shadow-lg flex items-center justify-between cursor-pointer active:scale-95 transition-transform" onClick={() => alert("Simulating QR Scan...")}>
          <div className="flex items-center space-x-4">
            <div className="bg-brand-green/10 p-3 rounded-xl">
              <QrCode className="w-8 h-8 text-brand-green" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Scan to Redeem</h3>
              <p className="text-xs text-gray-500">Show to {vendor.ownerName}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-full">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex bg-gray-200 p-1 rounded-xl">
            <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'rewards' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                onClick={() => setActiveTab('rewards')}
            >
                Rewards
            </button>
            <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                onClick={() => setActiveTab('history')}
            >
                History
            </button>
        </div>

        {/* Rewards Section */}
        {activeTab === 'rewards' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in">
            {rewards.map(reward => {
              const canAfford = user.currentPoints >= reward.pointsRequired;
              const progress = Math.min((user.currentPoints / reward.pointsRequired) * 100, 100);
              
              return (
                <div key={reward.id} className={`bg-white p-4 rounded-2xl border-2 ${canAfford ? 'border-brand-saffron' : 'border-gray-100'} shadow-sm relative overflow-hidden`}>
                   {canAfford && (
                       <div className="absolute top-0 right-0 bg-brand-saffron text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                           READY
                       </div>
                   )}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">{reward.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{reward.description}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-bold text-gray-900">{reward.pointsRequired}</span>
                        <span className="text-xs text-gray-400 block">pts</span>
                    </div>
                  </div>
                  
                  {!canAfford && (
                      <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-green rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                      </div>
                  )}

                  {canAfford && (
                      <Button className="w-full mt-3 py-2 text-sm bg-brand-saffron hover:bg-orange-600 shadow-md shadow-orange-200" onClick={() => alert(`Redeeming: ${reward.name}`)}>
                          Redeem Now
                      </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in text-center py-10">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recent transactions</p>
            </div>
        )}
      </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-200 flex justify-around py-2 px-2 z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
            <button className="flex flex-col items-center p-2 text-brand-saffron">
                <Star className="w-6 h-6 fill-current" />
                <span className="text-[10px] font-bold mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-400">
                <History className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">Activity</span>
            </button>
            <button className="flex flex-col items-center p-2 text-gray-400">
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium mt-1">Profile</span>
            </button>
        </div>
    </div>
  );
};

export default CustomerPortal;
