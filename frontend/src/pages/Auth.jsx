import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
        setIsLogin(true);
        setError('Signup successful! Please login.');
        setIsLoading(false);
        return;
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-3xl shadow-2xl border border-slate-800/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-500/10">
            <BrainCircuit className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">CareerFlux</h1>
          <p className="text-slate-400 text-sm mt-2">Empowering your academic journey</p>
        </div>

        <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className={isLogin && error.includes('successful') ? "mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm" : "mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 group mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
