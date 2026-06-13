import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import { socket } from '../socket/socket';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import CrisisBanner from '../components/CrisisBanner';
import { Send, LogOut, LayoutDashboard, Menu, X, Heart } from 'lucide-react';

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { 
    messages, 
    isTyping, 
    crisisAlert, 
    error, 
    sendMessage, 
    loadHistory, 
    messagesEndRef,
    setCrisisAlert 
  } = useChat(sessionId);

  useEffect(() => {
    // Generate or retrieve session ID
    let currentSession = localStorage.getItem('mindbloom_session_id');
    if (!currentSession) {
      currentSession = `session_${user.id}_${Date.now()}`;
      localStorage.setItem('mindbloom_session_id', currentSession);
    }
    setSessionId(currentSession);

    // Connect socket if not connected
    if (!socket.connected) {
      // Need to get token from cookie ideally, but we'll try to let server read it
      // or we can pass it if we stored it in localstorage. 
      // Our backend reads from cookie, but socket.io doesn't send cookies automatically in polling mode sometimes.
      // We will rely on withCredentials: true.
      
      // Let's grab the token from cookie just in case
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      const token = match ? match[2] : null;
      
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      // Don't disconnect on unmount so we keep connection alive
      // unless user logs out
    };
  }, [user]);

  useEffect(() => {
    if (sessionId && socket.connected) {
      loadHistory();
    } else if (sessionId) {
      socket.once('connect', () => {
        loadHistory();
      });
    }
  }, [sessionId, loadHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleLogout = async () => {
    await logout();
    socket.disconnect();
    navigate('/login');
  };

  const startNewSession = () => {
    const newSession = `session_${user.id}_${Date.now()}`;
    localStorage.setItem('mindbloom_session_id', newSession);
    setSessionId(newSession);
    // Messages will naturally clear because the hook depends on events, 
    // but we can force a reload. 
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Crisis Banner Overlay */}
      {crisisAlert && <CrisisBanner onClose={() => setCrisisAlert(null)} />}

      {/* Sidebar - Mobile overlay */}
      <div className={`fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">MindBloom</span>
          </div>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button 
            onClick={startNewSession}
            className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
          >
            + New Chat Session
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-4 shrink-0 z-10 sticky top-0">
          <button className="md:hidden p-2 -ml-2 mr-2 text-slate-500 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 leading-tight">MindBloom AI</h2>
              <p className="text-xs text-slate-500 leading-tight">Always here to listen</p>
            </div>
          </div>
        </header>

        {/* Error Toast */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 text-sm font-medium text-center border-b border-red-100">
            {error}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          {messages.length === 0 && !isTyping && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-10 h-10 text-indigo-300" />
              </div>
              <p className="text-center max-w-md">
                Hi {user.name}, I'm MindBloom. This is a safe space.<br/>
                How are you feeling today?
              </p>
            </div>
          )}
          
          <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
            {messages.map((msg, index) => (
              <MessageBubble key={msg._id || index} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={handleSubmit}
              className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-sm"
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-0 outline-none resize-none py-3 px-3 max-h-32 min-h-[44px]"
                rows="1"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0 mb-0.5 shadow-md"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider">
              Confidential & Secure • AI Assisted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
