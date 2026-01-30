import React, { useState } from 'react';
import { TrendingUp, Users, Zap, QrCode, MessageCircle, ArrowUp } from 'lucide-react';
import './index.css';

interface Transaction {
  id: string;
  customerVPA: string;
  amount: number;
  timestamp: string;
  pointsEarned: number;
}

interface Customer {
  vpa: string;
  totalSpent: number;
  pointsBalance: number;
  visits: number;
  lastVisit: string;
}

export default function App() {
  const [todayRevenue, setTodayRevenue] = useState(1240);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      customerVPA: 'rajesh@paytm',
      amount: 120,
      timestamp: '10:45 AM',
      pointsEarned: 12,
    },
    {
      id: '2',
      customerVPA: 'priya@phonepe',
      amount: 85,
      timestamp: '11:20 AM',
      pointsEarned: 8,
    },
    {
      id: '3',
      customerVPA: 'amit@okhlo',
      amount: 200,
      timestamp: '12:00 PM',
      pointsEarned: 20,
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      vpa: 'rajesh@paytm',
      totalSpent: 2400,
      pointsBalance: 240,
      visits: 20,
      lastVisit: 'Today',
    },
    {
      vpa: 'priya@phonepe',
      totalSpent: 1850,
      pointsBalance: 185,
      visits: 15,
      lastVisit: 'Yesterday',
    },
    {
      vpa: 'amit@okhlo',
      totalSpent: 3200,
      pointsBalance: 320,
      visits: 32,
      lastVisit: 'Today',
    },
  ]);

  const [showQR, setShowQR] = useState(false);

  // Simulate a payment webhook
  const simulatePayment = (amount: number, customerVPA: string) => {
    const pointsEarned = Math.floor(amount / 10);
    
    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      customerVPA,
      amount,
      timestamp: new Date().toLocaleTimeString(),
      pointsEarned,
    };
    setTransactions([newTransaction, ...transactions]);

    // Update revenue
    setTodayRevenue(todayRevenue + amount);

    // Update customer points
    setCustomers(
      customers.map(c =>
        c.vpa === customerVPA
          ? {
              ...c,
              pointsBalance: c.pointsBalance + pointsEarned,
              totalSpent: c.totalSpent + amount,
              visits: c.visits + 1,
              lastVisit: 'Just now',
            }
          : c
      )
    );

    // Simulate WhatsApp notification
    alert(`✅ Payment processed!\n\n💬 WhatsApp sent to customer:\n"You earned ${pointsEarned} points! Free chai next visit. 🍵"`);
  };

  const totalCustomers = customers.length;
  const totalPointsAwarded = transactions.reduce((sum, t) => sum + t.pointsEarned, 0);
  const activeCustomers = customers.filter(c => c.lastVisit === 'Today').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">🇮🇳</span>
            VendorVerse
          </h1>
          <p className="text-gray-600 mt-2">Loyalty for India's 12 Million Street Vendors</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Aaj ki Kamai</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{todayRevenue}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <ArrowUp size={14} /> {transactions.length} transactions
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCustomers}</p>
                <p className="text-xs text-blue-600 mt-2">{activeCustomers} active today</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Points Awarded</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalPointsAwarded}</p>
                <p className="text-xs text-purple-600 mt-2">1 point = ₹1 value</p>
              </div>
              <Zap className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Your QR Code</p>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                >
                  Show QR
                </button>
              </div>
              <QrCode className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4">Your UPI QR Code</h2>
              <div className="bg-gray-100 p-6 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center">
                  📱 Scan this QR with any UPI app
                  <br />
                  <br />
                  (In production: real QR image)
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Share this QR with your customers. They scan it, pay, and points are auto-credited.</p>
              <button
                onClick={() => setShowQR(false)}
                className="w-full py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-Time Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Real-Time Transactions</h2>
              <div className="space-y-4">
                {transactions.map(txn => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{txn.customerVPA}</p>
                      <p className="text-sm text-gray-600">{txn.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{txn.amount}</p>
                      <p className="text-sm text-green-600">+{txn.pointsEarned} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Payment Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">💡 Test Payment Webhook</h3>
              <p className="text-gray-600 text-sm mb-4">Click to simulate a customer payment. Watch points auto-credit.</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => simulatePayment(100, 'rajesh@paytm')}
                  className="py-2 px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition text-sm"
                >
                  ₹100 Payment
                </button>
                <button
                  onClick={() => simulatePayment(150, 'priya@phonepe')}
                  className="py-2 px-4 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition text-sm"
                >
                  ₹150 Payment
                </button>
                <button
                  onClick={() => simulatePayment(200, 'amit@okhlo')}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition text-sm"
                >
                  ₹200 Payment
                </button>
                <button
                  onClick={() => simulatePayment(75, 'new@customer')}
                  className="py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-sm"
                >
                  ₹75 New Customer
                </button>
              </div>
            </div>
          </div>

          {/* Customer Ledger */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Ledger</h2>
              <div className="space-y-3">
                {customers.map(customer => (
                  <div
                    key={customer.vpa}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition"
                  >
                    <p className="font-medium text-gray-900 text-sm">{customer.vpa}</p>
                    <div className="mt-3 space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Visits:</span>
                        <span className="font-medium">{customer.visits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span className="font-medium">₹{customer.totalSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Points:</span>
                        <span className="font-medium text-green-600">{customer.pointsBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Visit:</span>
                        <span className="font-medium">{customer.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Highlight */}
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-sm p-6 mt-6 text-white">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <MessageCircle size={20} /> Zero-UI Innovation
              </h3>
              <ul className="text-sm space-y-2">
                <li>✅ Customer scans your UPI QR</li>
                <li>✅ Points auto-credited (no app needed)</li>
                <li>✅ WhatsApp notification sent</li>
                <li>✅ 0% vendor effort, 100% retention</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>VendorVerse • Loyalty for India's Informal Economy</p>
          <p className="mt-2 text-xs text-gray-500">This is an interactive MVP. Real implementation requires UPI webhook integration.</p>
        </div>
      </div>
    </div>
  );
}
