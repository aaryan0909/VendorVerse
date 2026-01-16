import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { CheckCircle, QrCode, MessageSquare, Smartphone, ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CURRENT_VENDOR } from '../mockData';

const SimulatePayment = () => {
    const { vendor, t, isDemo } = useContext(AppContext);
    const queryClient = useQueryClient();
    
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
    const [pointsEarned, setPointsEarned] = useState(0);

    const processTransaction = useMutation({
        mutationFn: async () => {
            // Simulation Delay
            await new Promise(r => setTimeout(r, 1500));
            
            const earned = Math.floor((parseInt(amount || '0') / 10) * (vendor.points_per_10_rupees || 1));
            setPointsEarned(earned);

            if (isDemo) {
                return earned; // Skip DB in demo
            }

            if (!amount || !phone) throw new Error("Missing info");
            
            // 1. Calculate Points
            const points = earned;
            
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
                payment_method: 'phonepe' // Simulating UPI
            });

            // 4. Update Balance
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
        onSuccess: () => {
            setStatus('SUCCESS');
            queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
            queryClient.invalidateQueries({ queryKey: ['recentTxns'] });
        },
        onError: (err) => {
            alert("Error: " + err.message);
        }
    });

    const handleSimulate = () => {
        setStatus('PROCESSING');
        processTransaction.mutate();
    }

    const reset = () => {
        setStatus('IDLE');
        setAmount('');
        setPhone('');
    }

    if (status === 'SUCCESS') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-green-200 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Captured!</h2>
                
                {/* Simulated SMS Preview */}
                <div className="bg-gray-100 p-4 rounded-xl text-left max-w-xs mx-auto mb-6 relative border border-gray-200">
                    <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" /> SMS SENT
                    </div>
                    <p className="text-sm text-gray-800 font-mono leading-relaxed">
                        "Your payment of ₹{amount} at <strong>{vendor.business_name || CURRENT_VENDOR.business_name}</strong> was successful. You earned <strong>{pointsEarned} Pts!</strong> 
                        <br/><br/>
                        Tap to collect & redeem: <span className="text-blue-600 underline">vverse.in/d/2x9a</span>"
                    </p>
                </div>

                <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                    The customer has received a link to download the VendorVerse app and track their rewards.
                </p>

                <Button onClick={reset} className="w-full">Next Customer</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24">
            <h1 className="text-2xl font-extrabold text-gray-900">Simulate Transaction</h1>
            <p className="text-gray-500 text-sm">
                Since we are in test mode, use this form to simulate a customer paying via PhonePe/GPay/Paytm.
            </p>

            <Card className="p-6 border-t-4 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <QrCode className="w-32 h-32" />
                </div>

                <div className="space-y-6 relative z-10">
                    <Input 
                        label="Customer Mobile (Linked to UPI)"
                        type="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                    />
                    <Input 
                        label="Bill Amount (₹)"
                        type="number"
                        placeholder="e.g. 150"
                        value={amount}
                        onChange={(e: any) => setAmount(e.target.value)}
                    />
                    
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-blue-800 uppercase">Est. Points</span>
                            <span className="text-2xl font-extrabold text-blue-600">
                                {amount ? Math.floor((parseInt(amount) / 10) * (vendor.points_per_10_rupees || 1)) : 0}
                            </span>
                        </div>
                        <p className="text-[10px] text-blue-600">Based on rule: {vendor.points_per_10_rupees || 1} Pt / ₹10</p>
                    </div>

                    <Button 
                        className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 border-blue-800" 
                        onClick={handleSimulate}
                        isLoading={status === 'PROCESSING'}
                    >
                        {status === 'PROCESSING' ? 'Connecting to Bank...' : 'Simulate Payment Recieved'} 
                        {!status && <Smartphone className="w-5 h-5 ml-2" />}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SimulatePayment;