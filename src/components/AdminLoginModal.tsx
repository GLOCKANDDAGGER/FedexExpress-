import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { FedExLogo } from './FedExLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials against requested specifications:
      // Username: admin, Password: pas123
      if (username.trim() === 'admin' && password === 'pas123') {
        setIsLoading(false);
        setUsername('');
        setPassword('');
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid administrator credentials. Please check your username and password.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('pas123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header in FedEx Purple */}
        <div className="bg-[#4D148C] p-6 text-white text-center relative border-b border-[#3b0f6d]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-2">
            <FedExLogo variant="white" size="lg" />
          </div>
          <h3 className="text-lg font-black tracking-tight text-white">FedEx Internal Admin Portal</h3>
          <p className="text-xs text-white/80 mt-1">Authorized Operations & Logistics Personnel Only</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Operator Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter operator username (e.g. admin)"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/20 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/20 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#FF6200] hover:bg-[#E05600] disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FF6200]"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Authenticate & Open Admin Panel</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>

          {/* Quick Credential Test Helper for smooth review */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin: <strong className="text-slate-800">admin</strong> / <strong className="text-slate-800">pas123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-bold text-[#4D148C] hover:underline cursor-pointer"
            >
              Auto-fill Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
