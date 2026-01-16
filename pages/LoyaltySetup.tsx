import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { Save, Plus, Trash2, Gift } from 'lucide-react';
import { Reward } from '../types';

const LoyaltySetup = () => {
  const { vendor, updateVendor, rewards, updateRewards } = useContext(AppContext);
  const [localSettings, setLocalSettings] = useState(vendor);
  const [newReward, setNewReward] = useState<Partial<Reward>>({ name: '', pointsRequired: 0, description: '' });

  const handleSaveSettings = () => {
    updateVendor(localSettings);
    alert('Program settings saved successfully!');
  };

  const handleAddReward = () => {
    if (!newReward.name || !newReward.pointsRequired) return;
    const reward: Reward = {
      id: Date.now().toString(),
      name: newReward.name!,
      pointsRequired: newReward.pointsRequired!,
      description: newReward.description || '',
      image: `https://picsum.photos/200/200?random=${Date.now()}`,
      isActive: true,
      redemptionCount: 0
    };
    updateRewards([...rewards, reward]);
    setNewReward({ name: '', pointsRequired: 0, description: '' });
  };

  const handleDeleteReward = (id: string) => {
    updateRewards(rewards.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loyalty Program Setup</h1>
        <p className="text-gray-500">Configure how your customers earn and burn points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules Configuration */}
        <Card className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-brand-orange/10 rounded-lg">
                    <Gift className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Earning Rules</h3>
            </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points per ₹100 Spent
            </label>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={localSettings.pointsPer10Rupees} 
                onChange={(e) => setLocalSettings({...localSettings, pointsPer10Rupees: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
              />
              <span className="text-2xl font-bold text-brand-orange">{localSettings.pointsPer10Rupees}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Customer earns {localSettings.pointsPer10Rupees} points for every ₹100 spent.
            </p>
          </div>

          <Input 
            label="Minimum Transaction Amount (₹)" 
            type="number" 
            value={localSettings.minSpend || ''}
            onChange={(e: any) => setLocalSettings({...localSettings, minSpend: parseInt(e.target.value)})}
          />

            <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Membership Tiers (Points Required)</label>
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Silver Tier" 
                        type="number"
                        value={localSettings.tierSilver || ''}
                        onChange={(e: any) => setLocalSettings({...localSettings, tierSilver: parseInt(e.target.value)})}
                    />
                    <Input 
                        label="Gold Tier" 
                        type="number"
                        value={localSettings.tierGold || ''}
                        onChange={(e: any) => setLocalSettings({...localSettings, tierGold: parseInt(e.target.value)})}
                    />
                </div>
            </div>

          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="w-4 h-4 mr-2" /> Save Rules
          </Button>
        </Card>

        {/* Rewards Catalog */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Reward</h3>
            <div className="space-y-4">
              <Input 
                placeholder="Reward Name (e.g., Free Chai)" 
                value={newReward.name}
                onChange={(e: any) => setNewReward({...newReward, name: e.target.value})}
              />
              <Input 
                placeholder="Points Cost (e.g., 100)" 
                type="number"
                value={newReward.pointsRequired || ''}
                onChange={(e: any) => setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})}
              />
               <Input 
                placeholder="Description" 
                value={newReward.description}
                onChange={(e: any) => setNewReward({...newReward, description: e.target.value})}
              />
              <Button variant="outline" onClick={handleAddReward} className="w-full border-dashed">
                <Plus className="w-4 h-4 mr-2" /> Add to Catalog
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Active Rewards</h4>
            {rewards.map(reward => (
              <Card key={reward.id} className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <img src={reward.image} alt={reward.name} className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                  <div>
                    <p className="font-bold text-gray-900">{reward.name}</p>
                    <p className="text-xs text-brand-orange font-medium">{reward.pointsRequired} Points</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteReward(reward.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltySetup;