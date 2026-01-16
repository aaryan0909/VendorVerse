import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AppContext } from '../App';
import { Button, Input, Card } from '../components/UIComponents';

const Login = () => {
    const { t, setVendor } = useContext(AppContext);
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        if (phone.length < 10) return alert('Invalid Phone Number');
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            phone: `+91${phone}`
        });
        setLoading(false);
        if (error) {
            alert('Error sending OTP: ' + error.message);
        } else {
            setStep('OTP');
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.verifyOtp({
            phone: `+91${phone}`,
            token: otp,
            type: 'sms'
        });

        if (error) {
            alert('Invalid Code');
            setLoading(false);
            return;
        }

        if (data.user) {
            // Check if vendor profile exists
            const { data: vendorData } = await supabase
                .from('vendors')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (vendorData) {
                setVendor(vendorData);
                navigate('/vendor');
            } else {
                navigate('/onboarding');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-saffron flex flex-col justify-center items-center p-6">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Store className="w-8 h-8 text-brand-saffron" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{t('loginTitle')}</h1>
                </div>

                {step === 'PHONE' ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-gray-500 font-bold">+91</span>
                            <input 
                                type="tel" 
                                className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-lg focus:border-brand-saffron focus:outline-none"
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g,''))}
                            />
                        </div>
                        <Button 
                            className="w-full text-lg" 
                            onClick={handleSendOtp}
                            isLoading={loading}
                        >
                            {t('sendOtp')} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input 
                            type="text" 
                            className="text-center text-2xl tracking-widest"
                            placeholder="123456"
                            maxLength={6}
                            value={otp}
                            onChange={(e: any) => setOtp(e.target.value)}
                        />
                        <Button 
                            className="w-full text-lg" 
                            onClick={handleVerifyOtp}
                            isLoading={loading}
                        >
                            {t('verifyOtp')}
                        </Button>
                        <button 
                            onClick={() => setStep('PHONE')} 
                            className="w-full text-center text-sm text-gray-500 font-bold mt-4"
                        >
                            Change Number
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-center text-white/80 text-xs">
                <p>VendorVerse India</p>
                <p>Empowering Small Businesses</p>
            </div>
        </div>
    );
};

export default Login;