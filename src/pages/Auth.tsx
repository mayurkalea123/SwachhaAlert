import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { WARDS } from '@/lib/mockData';

interface Props {
  mode: 'login' | 'register';
}

export default function Auth({ mode }: Props) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', ward: WARDS[0], confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (mode === 'login') {
        const success = login(form.email, form.password);
        if (success) {
          const user = JSON.parse(localStorage.getItem('swachha_user') || '{}');
          navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          setError('Invalid email or password. Try the demo credentials below.');
        }
      } else {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        register(form.name, form.email, form.password, form.phone, form.ward);
        navigate('/dashboard');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 to-emerald-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center shadow-xl">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Swachha</span>
              <span className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'Sora, sans-serif' }}>Alert</span>
            </div>
          </Link>
          <p className="text-emerald-300 mt-2 text-sm">Smart Waste Reporting Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            {mode === 'login' ? 'Welcome Back' : 'Join SwachhaAlert'}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {mode === 'login' ? 'Sign in to your account to continue.' : 'Create your account and start reporting.'}
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input
                  name="name" type="text" required value={form.name} onChange={handleChange}
                  placeholder="Arjun Sharma"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all"
              />
            </div>
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Your Ward</label>
                  <select
                    name="ward" value={form.ward} onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all bg-white"
                  >
                    {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <input
                  name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-[hsl(158,64%,32%)] focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link to={mode === 'login' ? '/register' : '/login'} className="text-[hsl(158,64%,32%)] font-semibold hover:underline">
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </Link>
          </p>

          {mode === 'login' && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-xs text-emerald-700 font-semibold mb-1">Demo Credentials:</p>
              <div className="text-xs text-emerald-600 space-y-0.5">
                <p>Citizen: arjun@example.com / citizen123</p>
                <p>Admin: admin@swachha.gov.in / admin123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
