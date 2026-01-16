import React, { useState } from 'react';
import { Database, Save, ArrowRight, PlayCircle, Trash2, HelpCircle } from 'lucide-react';
import { Button, Input, Card } from '../components/UIComponents';
import { useNavigate } from 'react-router-dom';
import { resetConnection } from '../lib/supabase';

const EnvSetup = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('https://veypwpdphwkkrryqrzhp.supabase.co');
  const [key, setKey] = useState('4fa6e373-9fc3-49ba-aeab-b2d15104ca1c');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!url || !key) return alert('Please enter both URL and Key');
    
    setLoading(true);
    
    // Save to LocalStorage
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_key', key.trim());

    // Artificial delay for UX
    setTimeout(() => {
      setLoading(false);
      window.location.reload(); 
    }, 1000);
  };

  const handleSkip = () => {
      localStorage.removeItem('supabase_url');
      localStorage.removeItem('supabase_key');
      navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-brand-saffron relative">
        <button 
            onClick={resetConnection} 
            className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
            title="Reset All Data"
        >
            <Trash2 className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Connect Database</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your Supabase credentials.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Project URL</label>
            <Input 
              placeholder="https://veypwpdphwkkrryqrzhp.supabase.co"
              value={url}
              onChange={(e: any) => setUrl(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Anon Public Key</label>
            <Input 
              placeholder="Paste your key here..."
              value={key}
              onChange={(e: any) => setKey(e.target.value)}
              type="password"
            />
          </div>

          <Button className="w-full text-lg" onClick={handleSave} isLoading={loading}>
            Save & Connect <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            onClick={handleSkip}
            className="w-full py-3 rounded-xl bg-brand-green text-white font-bold hover:bg-green-700 shadow-lg flex items-center justify-center transition-all"
          >
            <PlayCircle className="w-5 h-5 mr-2" /> Use Demo Mode (No Key Needed)
          </button>

        </div>
      </Card>
    </div>
  );
};

export default EnvSetup;