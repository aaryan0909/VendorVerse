import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AppContext } from '../App';
import { Button, Input, Card } from '../components/UIComponents';
import { Store } from 'lucide-react';

const VendorOnboarding = () => {
    const { t, setVendor } = useContext(AppContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ businessName: '', ownerName: '', upiId: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!form.businessName || !form.upiId) return alert("Fill all fields");
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('vendors')
            .insert({
                id: user.id,
                phone: user.phone || '',
                business_name: form.businessName,
                owner_name: form.ownerName,
                upi_id: form.upiId
            })
            .select()
            .single();

        if (error) {
            alert(error.message);
        } else {
            setVendor(data);
            navigate('/vendor');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-saffron flex flex-col justify-center items-center p-6">
            <Card className="w-full max-w-sm p-6">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Store className="w-6 h-6 text-brand-saffron" />
                    </div>
                    <h2 className="text-xl font-extrabold text-gray-900">{t('setupTitle')}</h2>
                </div>

                <div className="space-y-4">
                    <Input 
                        label={t('businessName')}
                        value={form.businessName}
                        onChange={(e: any) => setForm({...form, businessName: e.target.value})}
                    />
                    <Input 
                        label={t('ownerName')}
                        value={form.ownerName}
                        onChange={(e: any) => setForm({...form, ownerName: e.target.value})}
                    />
                    <Input 
                        label={t('upiId')}
                        value={form.upiId}
                        onChange={(e: any) => setForm({...form, upiId: e.target.value})}
                    />
                    <Button className="w-full" onClick={handleSubmit} isLoading={loading}>
                        {t('completeSetup')}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default VendorOnboarding;