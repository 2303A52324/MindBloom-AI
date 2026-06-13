import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { ArrowLeft, Activity, MessageSquare, AlertTriangle, Phone, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/chat/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { stats, recentMessages } = data || { stats: {}, recentMessages: [] };

  const emotionColors = {
    sadness: 'bg-blue-500',
    anger: 'bg-red-500',
    fear: 'bg-purple-500',
    joy: 'bg-yellow-400',
    disgust: 'bg-green-600',
    surprise: 'bg-orange-400',
    shame: 'bg-slate-500',
    loneliness: 'bg-slate-400',
    neutral: 'bg-gray-300'
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/chat" className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Your Dashboard</h1>
              <p className="text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalMessages || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Crisis Alerts</p>
              <p className="text-3xl font-bold text-slate-800">{stats.crisisCount || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Dominant Emotion</p>
              <p className="text-xl font-bold text-slate-800 capitalize mt-1">
                {stats.dominantEmotion || 'Neutral'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Recent Mood Timeline</h2>
              </div>
              
              {recentMessages.length > 0 ? (
                <div className="space-y-4">
                  {recentMessages.map((msg, idx) => (
                    <div key={msg._id || idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${emotionColors[msg.nlpData?.emotion] || emotionColors.neutral}`}></div>
                      <div>
                        <p className="text-slate-700">{msg.text}</p>
                        <div className="flex gap-3 mt-2 text-xs font-medium">
                          <span className="text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                          {msg.nlpData?.emotion && (
                            <span className="text-indigo-600 capitalize">• {msg.nlpData.emotion}</span>
                          )}
                          {msg.isCrisis && (
                            <span className="text-red-600">• Crisis Detected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No recent messages to display.</p>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-md text-white">
              <h2 className="text-xl font-bold mb-4">Professional Help</h2>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                While MindBloom is here to support you, it does not replace professional therapy. If you're struggling, please consider reaching out to a human counselor.
              </p>
              <button className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
                Find a Counselor
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-500" />
                Emergency Contacts
              </h2>
              <div className="space-y-4">
                <a href="tel:9152987821" className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 transition-colors">
                  <p className="font-semibold text-slate-800">iCall</p>
                  <p className="text-sm text-indigo-600 font-medium">9152987821</p>
                </a>
                <a href="tel:18602662345" className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 transition-colors">
                  <p className="font-semibold text-slate-800">Vandrevala</p>
                  <p className="text-sm text-indigo-600 font-medium">1860-2662-345</p>
                </a>
                <a href="tel:112" className="block p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 transition-colors">
                  <p className="font-semibold text-red-800">Emergency</p>
                  <p className="text-sm text-red-600 font-medium">112</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
