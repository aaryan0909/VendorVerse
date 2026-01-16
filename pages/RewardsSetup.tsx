
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input } from '../components/UIComponents';
import { Plus, Trash2, Gift, PenTool, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Reward } from '../types';

const RewardsSetup = () => {
  const { vendor, t } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [newReward, setNewReward] = useState({ name: '', pointsRequired: 50, description: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pointsRate, setPointsRate] = useState(vendor.points_per_10_rupees);

  // Fetch Rewards
  const { data: rewards } = useQuery({
      queryKey: ['rewards', vendor.id],
      queryFn: async () => {
          const { data } = await supabase.from('rewards').select('*').eq('vendor_id', vendor.id);
          return data || [];
      }
  });

  // Update Points Rule
  const updateRule = useMutation({
      mutationFn: async (val: number) => {
          await supabase.from('vendors').update({ points_per_10_rupees: val }).eq('id', vendor.id);
      },
      onSuccess: () => alert("Rule Saved!")
  });

  // Add Reward
  const addReward = useMutation({
      mutationFn: async () => {
          if (!newReward.name) throw new Error("Name required");
          await supabase.from('rewards').insert({
              vendor_id: vendor.id,
              name: newReward.name,
              points_required: newReward.pointsRequired,
              description: newReward.description
          });
      },
      onSuccess: () => {
          setIsFormOpen(false);
          setNewReward({ name: '', pointsRequired: 50, description: '' });
          queryClient.invalidateQueries({ queryKey: ['rewards'] });
      }
  });

  // Delete Reward
  const deleteReward = useMutation({
      mutationFn: async (id: string) => {
          await supabase.from('rewards').delete().eq('id', id);
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rewards'] })
  });

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{t('rewardsProgram')}</h1>
            <p className="text-gray-500 font-medium">{t('simpleRules')}</p>
        </div>
      </div>

      {/* Points Rule */}
      <Card className="p-6 bg-white border-2 border-brand-green/20 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-brand-green rounded-lg text-white">
                <PenTool className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">{t('pointsRule')}</h3>
        </div>
        
        <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">{t('howManyPoints')}</label>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input 
                    type="range" min="1" max="5" step="1"
                    value={pointsRate} 
                    onChange={(e) => setPointsRate(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-brand-saffron"
                />
                <div className="w-14 h-14 rounded-xl bg-brand-saffron text-white flex items-center justify-center font-extrabold text-2xl shrink-0 shadow-lg shadow-orange-200">
                    {pointsRate}
                </div>
            </div>
            
            <p className="text-sm text-gray-600 font-medium">
                {t('example')} <strong>{5 * pointsRate} Pts</strong>
            </p>
            
            <Button onClick={() => updateRule.mutate(pointsRate)} className="w-full mt-2" variant="secondary">
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
                    <Button onClick={() => addReward.mutate()} isLoading={addReward.isPending} className="w-full py-3 text-lg">
                        {t('addReward')}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Rewards List */}
      <div className="grid grid-cols-1 gap-4">
        {rewards?.map((reward: Reward) => (
        <Card key={reward.id} className="p-4 flex flex-row items-center border-l-4 border-l-brand-saffron relative overflow-hidden">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 mr-4">
                <Gift className="w-7 h-7 text-brand-saffron" />
            </div>
            <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-lg">{reward.name}</h4>
                <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm font-bold text-brand-saffron bg-orange-50 px-2 py-0.5 rounded">{reward.points_required} Pts</span>
                    <span className="text-xs text-gray-400 font-medium">{t('redeemed')}: {reward.redemption_count}</span>
                </div>
            </div>
            <button 
                className="bg-gray-50 p-3 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                onClick={() => deleteReward.mutate(reward.id)}
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardsSetup;
