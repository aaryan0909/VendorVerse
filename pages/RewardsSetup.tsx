import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input } from '../components/UIComponents';
import { Save, Plus, Trash2, Gift, PenTool, X } from 'lucide-react';
import { Reward } from '../types';

const RewardsSetup = () => {
  const { vendor, updateVendor, rewards, updateRewards, t } = useContext(AppContext);
  const [localVendor, setLocalVendor] = useState(vendor);
  const [newReward, setNewReward] = useState<Partial<Reward>>({ name: '', pointsRequired: 50, description: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveSettings = () => {
    updateVendor(localVendor);
    alert('Settings saved!');
  };

  const handleAddReward = () => {
    if (!newReward.name || !newReward.pointsRequired) {
        alert("Please enter a name and points cost");
        return;
    }
    const reward: Reward = {
      id: Date.now().toString(),
      name: newReward.name!,
      pointsRequired: newReward.pointsRequired!,
      description: newReward.description || '',
      isActive: true,
      redemptionCount: 0
    };
    updateRewards([...rewards, reward]);
    setNewReward({ name: '', pointsRequired: 50, description: '' });
    setIsFormOpen(false);
  };

  const handleDeleteReward = (id: string) => {
    if(window.confirm("Delete this reward?")) {
        updateRewards(rewards.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t('rewardsProgram')}</h1>
            <p className="text-gray-500 font-medium">{t('simpleRules')}</p>
        </div>
      </div>

      {/* Points Rule Card - High Visibility */}
      <Card className="p-6 bg-white border-2 border-brand-green/20 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-brand-green rounded-lg text-white">
                <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">{t('pointsRule')}</h3>
        </div>
        
        <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">
                {t('howManyPoints')}
            </label>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1"
                    value={localVendor.pointsPer10Rupees} 
                    onChange={(e) => setLocalVendor({...localVendor, pointsPer10Rupees: parseInt(e.target.value)})}
                    className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-saffron"
                />
                <div className="w-14 h-14 rounded-xl bg-brand-saffron text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-lg shadow-orange-200">
                    {localVendor.pointsPer10Rupees}
                </div>
            </div>
            
            <p className="text-sm text-gray-600 font-medium">
                {t('example')} <strong>{5 * localVendor.pointsPer10Rupees} Pts</strong>
            </p>
            
            <Button onClick={handleSaveSettings} className="w-full mt-2" variant="secondary">
                {t('saveChanges')}
            </Button>
        </div>
      </Card>

      {/* Catalog Header */}
      <div className="flex justify-between items-center pt-4">
         <h3 className="text-xl font-extrabold text-gray-900">{t('catalog')}</h3>
         {!isFormOpen && (
             <Button onClick={() => setIsFormOpen(true)} className="rounded-full px-4">
                 <Plus className="w-5 h-5 mr-1" /> {t('addReward')}
             </Button>
         )}
      </div>

      {/* Add Reward Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-extrabold text-xl text-gray-900">{t('createReward')}</h4>
                    <button onClick={() => setIsFormOpen(false)} className="bg-gray-100 p-2 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <Input 
                        label={t('rewardName')}
                        placeholder="e.g. Free Chai"
                        value={newReward.name}
                        onChange={(e: any) => setNewReward({...newReward, name: e.target.value})}
                    />
                        <Input 
                        label={t('pointsCost')}
                        type="number"
                        placeholder="e.g. 50"
                        value={newReward.pointsRequired}
                        onChange={(e: any) => setNewReward({...newReward, pointsRequired: parseInt(e.target.value)})}
                    />
                    <Input 
                        label={t('description')}
                        value={newReward.description}
                        onChange={(e: any) => setNewReward({...newReward, description: e.target.value})}
                    />
                    <Button onClick={handleAddReward} className="w-full py-3 text-lg">
                        {t('addReward')}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Rewards List */}
      <div className="grid grid-cols-1 gap-4">
        {rewards.map(reward => (
        <Card key={reward.id} className="p-4 flex flex-row items-center border-l-4 border-l-brand-saffron relative overflow-hidden">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 mr-4">
                <Gift className="w-7 h-7 text-brand-saffron" />
            </div>
            <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-lg">{reward.name}</h4>
                <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-bold text-brand-saffron bg-orange-50 px-2 py-0.5 rounded">{reward.pointsRequired} Pts</span>
                    <span className="text-xs text-gray-400 font-medium">{t('redeemed')}: {reward.redemptionCount}</span>
                </div>
            </div>
            
            <button 
                className="bg-gray-50 p-3 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                onClick={() => handleDeleteReward(reward.id)}
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </Card>
        ))}

        {rewards.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">{t('noRewards')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RewardsSetup;