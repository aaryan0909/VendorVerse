import React, { createContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Gift, QrCode as QrIcon, 
  Menu, ExternalLink, Zap, Store, Languages
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import RewardsSetup from './pages/RewardsSetup';
import CustomersPage from './pages/CustomersPage';
import CustomerPortal from './pages/CustomerPortal';
import { Button } from './components/UIComponents';
import { translations } from './translations';

import { 
  INITIAL_CUSTOMERS, INITIAL_REWARDS, CURRENT_VENDOR, 
  INITIAL_TRANSACTIONS, ANALYTICS_DATA 
} from './mockData';
import { Vendor, Customer, Reward, Transaction, AnalyticsData, Language } from './types';

// Context Definition
interface AppContextType {
  vendor: Vendor;
  customers: Customer[];
  rewards: Reward[];
  transactions: Transaction[];
  analyticsData: AnalyticsData[];
  language: Language;
  updateVendor: (v: Vendor) => void;
  updateRewards: (r: Reward[]) => void;
  simulateTransaction: () => void;
  setLanguage: (l: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const BottomNav = () => {
  const location = useLocation();
  const { t } = React.useContext(AppContext);
  
  const links = [
    { name: t('home'), path: '/vendor', icon: Home },
    { name: t('rewards'), path: '/vendor/rewards', icon: Gift },
    { name: t('customers'), path: '/vendor/customers', icon: Users },
    { name: t('qr'), path: '/vendor/qr', icon: QrIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
           const isActive = location.pathname === link.path;
           return (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-brand-saffron' : 'text-gray-500'}`}
            >
              <link.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-bold">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Desktop Sidebar (Still kept for larger screens, but simplified)
const Sidebar = () => {
  const location = useLocation();
  const { t } = React.useContext(AppContext);
  const links = [
    { name: t('home'), path: '/vendor', icon: Home },
    { name: t('rewards'), path: '/vendor/rewards', icon: Gift },
    { name: t('customers'), path: '/vendor/customers', icon: Users },
    { name: t('qr'), path: '/vendor/qr', icon: QrIcon },
  ];

  return (
    <div className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="h-20 flex items-center px-6 border-b border-gray-100 bg-brand-light">
        <div className="w-10 h-10 bg-brand-saffron rounded-full flex items-center justify-center mr-3 shadow-md border-2 border-white">
            <Store className="w-5 h-5 text-white" />
        </div>
        <div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight block">VendorVerse</span>
        </div>
      </div>
      <nav className="mt-6 space-y-2 px-4">
        {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
                <Link 
                    key={link.path} 
                    to={link.path}
                    className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        isActive 
                        ? 'bg-brand-saffron text-white shadow-lg shadow-orange-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                </Link>
            )
        })}
      </nav>
    </div>
  );
};

const Header = () => {
    const { language, setLanguage, vendor } = React.useContext(AppContext);
    
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center md:hidden">
                <div className="w-8 h-8 bg-brand-saffron rounded-lg flex items-center justify-center mr-2">
                    <Store className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 text-lg truncate max-w-[150px]">{vendor.businessName}</span>
            </div>
            <div className="hidden md:block">
                {/* Spacer for desktop */}
            </div>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full border border-gray-300 active:bg-gray-200 transition-colors"
            >
                <Languages className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">{language === 'en' ? 'English' : 'हिंदी'}</span>
            </button>
        </div>
    )
}

const VendorLayout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

const Landing = () => (
    <div className="min-h-screen bg-brand-saffron flex flex-col justify-center items-center p-6 relative">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <Store className="w-10 h-10 text-brand-saffron" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">VendorVerse</h1>
            <p className="text-gray-500 mb-8 font-medium">Customer Loyalty for India 🇮🇳</p>

            <div className="space-y-4">
                <Link to="/vendor" className="block w-full">
                    <div className="bg-brand-saffron hover:bg-orange-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center">
                        <Store className="w-5 h-5 mr-2" />
                        Merchant Login
                    </div>
                </Link>
                 <Link to="/customer" className="block w-full">
                    <div className="bg-white border-2 border-brand-green text-brand-green hover:bg-green-50 p-4 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center">
                        <Users className="w-5 h-5 mr-2" />
                        Customer View
                    </div>
                </Link>
            </div>
            
            <p className="mt-8 text-xs text-gray-400">Made for Chai Wallahs, Vada Pav Stalls & more.</p>
        </div>
    </div>
)

const App = () => {
  const [vendor, setVendor] = useState(CURRENT_VENDOR);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [analyticsData, setAnalyticsData] = useState(ANALYTICS_DATA);
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
      return translations[language][key] || key;
  };

  const simulateTransaction = () => {
      const amount = 50; 
      const points = Math.floor((amount / 10) * vendor.pointsPer10Rupees);
      const newTx: Transaction = {
          id: `tx${Date.now()}`,
          date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          amount,
          points,
          customerName: 'Amit Singh',
          vendorId: vendor.id,
          customerId: 'c1',
          type: 'EARN',
          paymentMethod: 'PhonePe'
      };
      
      setTransactions([newTx, ...transactions]);
      
      const updatedCustomers = customers.map(c => {
          if(c.id === 'c1') {
              return { 
                  ...c, 
                  currentPoints: c.currentPoints + points, 
                  totalPoints: c.totalPoints + points,
                  visits: c.visits + 1,
                  totalSpent: c.totalSpent + amount,
                  lastVisit: 'Just now'
                }
          }
          return c;
      });
      setCustomers(updatedCustomers);
      
      // Update Analytics
      const lastIdx = analyticsData.length - 1;
      const newAnalytics = [...analyticsData];
      
      newAnalytics[lastIdx] = {
        ...newAnalytics[lastIdx],
        revenue: newAnalytics[lastIdx].revenue + amount,
        visits: newAnalytics[lastIdx].visits + 1
      };
      
      setAnalyticsData(newAnalytics);

      // Visual Feedback
      const msg = language === 'en' 
        ? `₹${amount} received from Amit Singh! Added ${points} points.` 
        : `अमित सिंह से ₹${amount} प्राप्त हुए! ${points} पॉइंट्स जोड़े गए।`;
      
      alert(msg);
  };

  return (
    <AppContext.Provider value={{ 
        vendor, customers, rewards, transactions, analyticsData, language,
        updateVendor: setVendor, 
        updateRewards: setRewards,
        simulateTransaction,
        setLanguage,
        t
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/customer" element={<CustomerPortal />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor" element={<VendorLayout><Dashboard /></VendorLayout>} />
          <Route path="/vendor/rewards" element={<VendorLayout><RewardsSetup /></VendorLayout>} />
          <Route path="/vendor/customers" element={<VendorLayout><CustomersPage /></VendorLayout>} />
          
          <Route path="/vendor/qr" element={
            <VendorLayout>
                <div className="max-w-sm mx-auto bg-white p-6 rounded-3xl shadow-xl text-center border-4 border-brand-saffron mt-6">
                    <h2 className="text-2xl font-extrabold mb-2 text-gray-900">{t('scanPay')}</h2>
                    <p className="text-gray-500 mb-6 font-medium">{t('showCustomer')}</p>
                    
                    <div className="bg-white p-2 rounded-xl inline-block mb-6 relative">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${vendor.upiId}&pn=${vendor.businessName}`} alt="QR" className="rounded-lg border-2 border-gray-100" />
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-xl mb-6 border border-orange-100">
                        <p className="text-xs text-brand-saffron uppercase tracking-wide font-bold mb-1">BHIM UPI ID</p>
                        <p className="font-mono text-lg font-bold text-gray-900">{vendor.upiId}</p>
                    </div>
                    
                    <div className="space-y-3">
                        <Button className="w-full py-3 shadow-lg shadow-orange-100 bg-brand-saffron" onClick={() => alert("Printing not available in demo.")}>
                            {t('download')}
                        </Button>
                        <Button variant="outline" className="w-full py-3 border-2" onClick={() => alert("Shared to WhatsApp!")}>
                            {t('shareWhatsapp')}
                        </Button>
                    </div>
                </div>
            </VendorLayout>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;