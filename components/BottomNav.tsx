import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gift, Users, Zap, QrCode } from 'lucide-react';
import { AppContext } from '../App';

const BottomNav = () => {
  const location = useLocation();
  const { t } = React.useContext(AppContext);
  
  const links = [
    { name: t('home'), path: '/vendor', icon: Home },
    { name: t('simulate'), path: '/vendor/simulate', icon: Zap },
    { name: t('rewards'), path: '/vendor/rewards', icon: Gift },
    { name: t('customers'), path: '/vendor/customers', icon: Users },
  ];

  // Don't show on login/onboarding
  if (['/', '/login', '/onboarding', '/customer'].includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
           const isActive = location.pathname === link.path;
           return (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-brand-saffron' : 'text-gray-400'}`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-orange-50' : ''}`}>
                <link.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold mt-0.5">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;