import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Search, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const CustomersPage = () => {
    const { vendor, t } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: customers, isLoading } = useQuery({
        queryKey: ['customers', vendor.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('vendor_customers')
                .select('*, customers(name, phone)')
                .eq('vendor_id', vendor.id);
            return data || [];
        }
    });

    const filtered = customers?.filter(c => 
        c.customers?.phone.includes(searchTerm) || 
        c.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Customers...</div>;

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-gray-900">{t('myCustomers')}</h1>
                <span className="bg-brand-saffron text-white px-3 py-1 rounded-full text-sm font-bold">
                    {customers?.length || 0}
                </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-brand-saffron font-medium bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered?.map(c => {
                    const name = c.customers?.name || 'Guest';
                    const phone = c.customers?.phone;
                    
                    return (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-extrabold text-gray-900 text-lg">{name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mt-1 font-medium bg-gray-50 w-fit px-2 py-0.5 rounded">
                                    <Phone className="w-3 h-3 mr-1" /> {phone}
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${c.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                {c.tier?.toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-gray-50 mb-4 bg-gray-50/50 rounded-xl px-2">
                            <div className="text-center border-r border-gray-200">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('points')}</p>
                                <p className="text-xl font-extrabold text-brand-saffron">{c.points_balance}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('totalSpent')}</p>
                                <p className="text-xl font-extrabold text-gray-900">₹{c.total_spent}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            <span className="text-xs text-gray-400 font-medium">{t('lastVisit')}: {new Date(c.last_visit).toLocaleDateString()}</span>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default CustomersPage;