import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight, Loader2, Settings, PlayCircle } from 'lucide-react';
import { supabase, resetConnection, isConfigured } from '../lib/supabase';
import { AppContext } from '../App';
import { Button, Input, Card } from '../components/UIComponents';
import { CURRENT_VENDOR } from '../mockData';

const Login = () => {
    const { t, setVendor } = useContext(AppContext);
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);

    const enterDemoMode = () => {
        setVendor(CURRENT_VENDOR);
        navigate('/vendor');
    }

    const handleSendOtp = async () => {
        if (phone.length < 10) return alert('Please enter a valid 10-digit number');
        
        setLoading(true);

        // Check config before attempting
        if (!isConfigured()) {
            // If config is invalid, we don't even try Supabase.
            // We simulate the flow for the user so they can test the UI.
            setTimeout(() => {
                alert("Running in DEMO MODE (Database not connected). Use 123456 as OTP.");
                setStep('OTP');
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: `+91${phone}`
            });

            if (error) {
                console.error("Auth Error:", error);
                if (error.message.includes('Invalid API key')) {
                    const confirmDemo = window.confirm("Your Database API Key is invalid. Would you like to switch to Demo Mode?");
                    if (confirmDemo) enterDemoMode();
                } else {
                    alert('Error sending OTP: ' + error.message);
                }
            } else {
                alert("OTP Sent! Use 123456 if testing.");
                setStep('OTP');
            }
        } catch (err: any) {
            alert("Network Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        
        // Demo Mode Bypass
        if (!isConfigured()) {
            setTimeout(() => {
                if (otp === '123456') {
                    enterDemoMode();
                } else {
                    alert("Invalid Demo OTP. Use 123456");
                }
                setLoading(false);
            }, 800);
            return;
        }

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: `+91${phone}`,
                token: otp,
                type: 'sms'
            });

            if (error) {
                alert('Invalid Code: ' + error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
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
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-saffron flex flex-col justify-center items-center p-6 relative">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
                
                <button 
                    onClick={() => navigate('/setup-db')}
                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                    title="Database Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>

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
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <Button 
                            variant="outline"
                            className="w-full text-gray-600"
                            onClick={enterDemoMode}
                        >
                            <PlayCircle className="w-5 h-5 mr-2" /> Try Demo Mode
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;