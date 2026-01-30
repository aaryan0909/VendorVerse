import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Languages, Store, ArrowRight, Smartphone, Zap } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import RewardsSetup from './pages/RewardsSetup';
import CustomersPage from './pages/CustomersPage';
import CustomerPortal from './pages/CustomerPortal';
import Login from './pages/Login';
import VendorOnboarding from './pages/VendorOnboarding';
import SimulatePayment from './pages/SimulatePayment';
import EnvSetup from './pages/EnvSetup';

import BottomNav from './components/BottomNav';
import { translations } from './translations';
import { Vendor, Language } from './types';
import { supabase, isConfigured } from './lib/supabase';
import { CURRENT_VENDOR } from './mockData';

// Context Definition
interface AppContextType {
  vendor: Vendor;
  language: Language;
  setVendor: (v: Vendor) => void;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  isDemo: boolean;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
const queryClient = new QueryClient();

// Auth Checker
const AuthGuard = ({ children }: React.PropsWithChildren) => {
    const navigate = useNavigate();
    const { vendor, setVendor, isDemo } = React.useContext(AppContext);

    useEffect(() => {
        const checkUser = async () => {
            // 1. If in Demo Mode
            if (isDemo) {
                // If vendor is already set in memory (via Landing Page), allow access
                if (vendor?.id) return;
                
                // Otherwise redirect to landing to "Launch" the demo
                navigate('/');
                return;
            }

            // 2. Real Database Mode
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            // Fetch Vendor Profile
            const { data } = await supabase.from('vendors').select('*').eq('id', user.id).single();
            if (data) setVendor(data);
            else navigate('/onboarding');
        };
        checkUser();
    }, [navigate, setVendor, isDemo, vendor?.id]);

    // If we have a vendor (either mock or real), render children
    // If not, we are likely redirecting, so render null or loader
    return vendor?.id ? <>{children}</> : null;
};

const Header = () => {
    const { language, setLanguage, vendor, isDemo } = React.useContext(AppContext);
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-brand-saffron rounded-lg flex items-center justify-center mr-2">
                    <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg truncate max-w-[150px]">
                        {vendor?.business_name || 'VendorVerse'}
                    </span>
                    {isDemo && <span className="text-[10px] text-brand-green font-bold bg-green-50 px-1 rounded w-fit">DEMO PREVIEW</span>}
                </div>
            </div>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300 active:bg-gray-200 transition-colors"
            >
                <Languages className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">{language === 'en' ? 'En' : 'Hi'}</span>
            </button>
        </div>
    );
};

const VendorLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      <AuthGuard>
        <div className="md:ml-0">
            <Header />
            <main className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </main>
        </div>
        <BottomNav />
      </AuthGuard>
    </div>
  );
};

const Landing = () => {
    const navigate = useNavigate();
    const { setVendor } = React.useContext(AppContext);

    const launchVendorDemo = () => {
        // Hydrate with Mock Data
        setVendor(CURRENT_VENDOR);
        navigate('/vendor');
    };

    return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-saffron/20 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl -mr-20 -mb-20"></div>

        <div className="relative z-10 w-full max-w-md text-center">
            
            <div className="mb-8 inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-white text-xs font-bold tracking-wider uppercase">Live Interactive Demo</span>
            </div>

            <div className="w-24 h-24 bg-gradient-to-br from-brand-saffron to-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/30 transform -rotate-3">
                <Store className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">VendorVerse</h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                India's first <span className="text-white font-bold">UPI-Native Loyalty OS</span> for the 12 million street vendors who feed the nation.
            </p>

            <div className="space-y-4">
                <button 
                    onClick={launchVendorDemo} 
                    className="group w-full bg-white hover:bg-gray-50 text-gray-900 p-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center transition-all transform hover:scale-[1.02]"
                >
                    <div className="bg-brand-saffron p-1.5 rounded-lg mr-3 text-white">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    Launch Vendor App
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-400 group-hover:text-gray-900" />
                </button>

                 <button 
                    onClick={() => navigate('/customer')} 
                    className="group w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 p-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all"
                >
                    <div className="bg-gray-700 group-hover:bg-gray-600 p-1.5 rounded-lg mr-3">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    View Customer Portal
                    <ArrowRight className="w-5 h-5 ml-auto text-gray-500 group-hover:text-white" />
                </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-6 opacity-50">
                <span className="text-xs text-gray-400 font-medium">Zero App Download</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="text-xs text-gray-400 font-medium">No Hardware Required</span>
            </div>
        </div>
    </div>
    );
}

const App = () => {
  const [vendor, setVendor] = useState<Vendor>({} as Vendor);
  const [language, setLanguage] = useState<Language>('en');
  
  // If not configured, we run in Demo Mode
  const isDemo = !isConfigured();

  const t = (key: keyof typeof translations['en']) => {
      return translations[language][key] || key;
  };

  return (
    <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={{ 
            vendor, language, setVendor, setLanguage, t, isDemo
        }}>
        <Router>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/setup-db" element={<EnvSetup />} />
            <Route path="/onboarding" element={<VendorOnboarding />} />
            <Route path="/customer" element={<CustomerPortal />} />
            
            {/* Protected Vendor Routes */}
            <Route path="/vendor" element={<VendorLayout><Dashboard /></VendorLayout>} />
            <Route path="/vendor/simulate" element={<VendorLayout><SimulatePayment /></VendorLayout>} />
            <Route path="/vendor/rewards" element={<VendorLayout><RewardsSetup /></VendorLayout>} />
            <Route path="/vendor/customers" element={<VendorLayout><CustomersPage /></VendorLayout>} />
            </Routes>
        </Router>
        </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default App;