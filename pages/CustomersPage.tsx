import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { Search, Filter, Phone, MessageCircle } from 'lucide-react';

const CustomersPage = () => {
    const { customers, t } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-gray-900">{t('myCustomers')}</h1>
                <span className="bg-brand-saffron text-white px-3 py-1 rounded-full text-sm font-bold">
                    {customers.length}
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
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-extrabold text-gray-900 text-lg">{customer.name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mt-1 font-medium bg-gray-50 w-fit px-2 py-0.5 rounded">
                                    <Phone className="w-3 h-3 mr-1" /> {customer.phone}
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${customer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                                {customer.tier}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-gray-50 mb-4 bg-gray-50/50 rounded-xl px-2">
                            <div className="text-center border-r border-gray-200">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('points')}</p>
                                <p className="text-xl font-extrabold text-brand-saffron">{customer.currentPoints}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">{t('totalSpent')}</p>
                                <p className="text-xl font-extrabold text-gray-900">₹{customer.totalSpent}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                            <span className="text-xs text-gray-400 font-medium">{t('lastVisit')}: {customer.lastVisit}</span>
                            <div className="flex space-x-2">
                                <a href={`tel:${customer.phone}`} className="bg-green-50 text-green-600 p-2 rounded-full active:bg-green-100">
                                    <Phone className="w-5 h-5" />
                                </a>
                                <button className="bg-blue-50 text-blue-600 p-2 rounded-full active:bg-blue-100" onClick={() => alert("WhatsApp integration coming soon!")}>
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400 font-medium">Not found.</p>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;