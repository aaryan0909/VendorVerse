import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Languages, Store } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import RewardsSetup from './pages/RewardsSetup';
import CustomersPage from './pages/CustomersPage';
import CustomerPortal from './pages/CustomerPortal';
import Login from './pages/Login';
import VendorOnboarding from './pages/VendorOnboarding';
import SimulatePayment from './pages/SimulatePayment';

import BottomNav from './components/BottomNav';
import { translations } from './translations';
import { Vendor, Language } from './types';
import { supabase } from './lib/supabase';

// Context Definition
interface AppContextType {
  vendor: Vendor;
  language: Language;
  setVendor: (v: Vendor) => void;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
const queryClient = new QueryClient();

// Auth Checker
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { setVendor } = React.useContext(AppContext);

    useEffect(() => {
        const checkUser = async () => {
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
    }, [navigate, setVendor]);

    return <>{children}</>;
};

const Header = () => {
    const { language, setLanguage, vendor } = React.useContext(AppContext);
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-brand-saffron rounded-lg flex items-center justify-center mr-2">
                    <Store className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg truncate max-w-[150px]">{vendor?.business_name || 'VendorVerse'}</span>
            </div>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300 active:bg-gray-200 transition-colors"
            >
                <Languages className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">{language === 'en' ? 'English' : 'हिंदी'}</span>
            </button>
        </div>
    );
};

const VendorLayout = ({ children }: any) => {
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
    return (
    <div className="min-h-screen bg-brand-saffron flex flex-col justify-center items-center p-6 relative">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <Store className="w-10 h-10 text-brand-saffron" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">VendorVerse</h1>
            <p className="text-gray-500 mb-8 font-medium">Customer Loyalty for India 🇮🇳</p>

            <div className="space-y-4">
                <button onClick={() => navigate('/login')} className="w-full bg-brand-saffron hover:bg-orange-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 flex items-center justify-center">
                    Merchant Login
                </button>
                 <button onClick={() => navigate('/customer')} className="w-full bg-white border-2 border-brand-green text-brand-green hover:bg-green-50 p-4 rounded-xl font-bold text-lg flex items-center justify-center">
                    Customer View
                </button>
            </div>
            <p className="mt-8 text-xs text-gray-400">Production Ready Build v1.0</p>
        </div>
    </div>
    );
}

const App = () => {
  const [vendor, setVendor] = useState<Vendor>({} as Vendor);
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
      return translations[language][key] || key;
  };

  return (
    <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={{ 
            vendor, language, setVendor, setLanguage, t
        }}>
        <Router>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
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