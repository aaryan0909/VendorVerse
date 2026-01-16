
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { CheckCircle, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const SimulatePayment = () => {
    const { vendor, t } = useContext(AppContext);
    const queryClient = useQueryClient();
    
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');
    const [earned, setEarned] = useState(0);

    const processTransaction = useMutation({
        mutationFn: async () => {
            if (!amount || !phone) throw new Error("Missing info");
            
            // 1. Calculate Points
            const points = Math.floor((parseInt(amount) / 10) * vendor.points_per_10_rupees);
            
            // 2. Find or Create Customer
            let customerId;
            const { data: existingCust } = await supabase
                .from('customers')
                .select('id')
                .eq('phone', phone)
                .single();
            
            if (existingCust) {
                customerId = existingCust.id;
            } else {
                const { data: newCust, error } = await supabase
                    .from('customers')
                    .insert({ phone, name: 'Guest' })
                    .select('id')
                    .single();
                if (error) throw error;
                customerId = newCust.id;
            }

            // 3. Insert Transaction
            await supabase.from('transactions').insert({
                vendor_id: vendor.id,
                customer_id: customerId,
                amount: parseInt(amount),
                points_earned: points,
                type: 'EARN',
                payment_method: 'cash'
            });

            // 4. Update/Upsert Vendor_Customer Balance
            const { data: vcData } = await supabase
                .from('vendor_customers')
                .select('points_balance, total_spent, visit_count')
                .eq('vendor_id', vendor.id)
                .eq('customer_id', customerId)
                .single();

            if (vcData) {
                await supabase.from('vendor_customers').update({
                    points_balance: vcData.points_balance + points,
                    total_spent: vcData.total_spent + parseInt(amount),
                    visit_count: vcData.visit_count + 1,
                    last_visit: new Date().toISOString()
                })
                .eq('vendor_id', vendor.id)
                .eq('customer_id', customerId);
            } else {
                await supabase.from('vendor_customers').insert({
                    vendor_id: vendor.id,
                    customer_id: customerId,
                    points_balance: points,
                    total_spent: parseInt(amount),
                    visit_count: 1,
                    last_visit: new Date().toISOString()
                });
            }

            return points;
        },
        onSuccess: (points) => {
            setEarned(points);
            setStatus('SUCCESS');
            queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
            queryClient.invalidateQueries({ queryKey: ['recentTxns'] });
            setTimeout(() => {
                setStatus('IDLE');
                setAmount('');
                setPhone('');
            }, 3000);
        },
        onError: (err) => {
            alert("Error: " + err.message);
        }
    });

    if (status === 'SUCCESS') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('paymentReceived')}</h2>
                <p className="text-xl text-gray-600">Added <span className="font-bold text-brand-saffron">{earned} pts</span></p>
                <p className="text-sm text-gray-400 mt-8">Returning to form...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-extrabold text-gray-900">{t('simTitle')}</h1>
            <Card className="p-6 border-t-4 border-brand-saffron">
                <div className="flex items-center space-x-3 mb-6 bg-orange-50 p-4 rounded-xl">
                    <Zap className="w-6 h-6 text-brand-saffron" />
                    <p className="text-sm text-gray-700 font-medium">{t('simDesc')}</p>
                </div>

                <div className="space-y-6">
                    <Input 
                        label={t('custPhone')}
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                    />
                    <Input 
                        label={t('amount')}
                        type="number"
                        placeholder="50"
                        value={amount}
                        onChange={(e: any) => setAmount(e.target.value)}
                    />
                    
                    <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-500">Points to be added:</span>
                        <span className="text-2xl font-extrabold text-brand-saffron">
                            {amount ? Math.floor((parseInt(amount) / 10) * vendor.points_per_10_rupees) : 0}
                        </span>
                    </div>

                    <Button 
                        className="w-full py-4 text-lg" 
                        onClick={() => processTransaction.mutate()}
                        isLoading={processTransaction.isPending}
                    >
                        {t('simulatePay')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SimulatePayment;
