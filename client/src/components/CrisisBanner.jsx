import { X, Phone, AlertCircle } from 'lucide-react';

const CrisisBanner = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-red-600 p-6 flex items-start justify-between text-white">
          <div className="flex gap-3">
            <AlertCircle className="w-8 h-8 flex-shrink-0 animate-pulse" />
            <div>
              <h2 className="text-xl font-bold mb-1">We are here for you</h2>
              <p className="text-red-100 text-sm">Please know that you are not alone. There are people who want to help you right now.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 mb-6 font-medium">Please reach out immediately to one of these free, confidential helplines. They are available 24/7:</p>
          
          <div className="space-y-4">
            <a href="tel:9152987821" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">iCall (India)</h3>
                <p className="text-sm text-slate-500">Psychosocial helpline</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-100/50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" />
                9152987821
              </div>
            </a>
            
            <a href="tel:18602662345" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">Vandrevala Foundation</h3>
                <p className="text-sm text-slate-500">Mental health support</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-100/50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" />
                1860-2662-345
              </div>
            </a>
            
            <a href="tel:04424640050" className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group">
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">SNEHI</h3>
                <p className="text-sm text-slate-500">Suicide prevention</p>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-100/50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" />
                044-24640050
              </div>
            </a>
            
            <a href="tel:112" className="flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-all group">
              <div>
                <h3 className="font-bold text-red-800">National Emergency</h3>
                <p className="text-sm text-red-600">Immediate medical assistance</p>
              </div>
              <div className="flex items-center gap-2 text-red-700 font-bold bg-red-200/50 px-3 py-1.5 rounded-lg">
                <Phone className="w-4 h-4" />
                112
              </div>
            </a>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            I understand, close this message
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisBanner;
