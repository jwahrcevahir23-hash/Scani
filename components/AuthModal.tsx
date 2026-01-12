
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, Key, ShieldQuestion, ArrowLeft, FlaskConical } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userType: 'admin' | 'customer', userData?: any) => void;
}

type AuthMode = 'signin' | 'register' | 'forgot-request' | 'forgot-reset';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState(''); // Used for both registration and verification
  
  // Forgot Password specific
  const [newPassword, setNewPassword] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
    setRecoveryKey('');
    setNewPassword('');
    setVerifiedUser(null);
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  // --- DEV MODE OVERRIDE ---
  const handleDevBypass = () => {
    onLoginSuccess('customer', { 
      name: 'Dev Tester', 
      email: 'tester@realview.dev', 
      status: 'active',
      joinedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const storedUsers = JSON.parse(localStorage.getItem('realview_users') || '[]');

      // ==========================================
      // SIGN IN
      // ==========================================
      if (mode === 'signin') {
        // Admin Login Check
        if (email === 'jwahrcevahir23@gmail.com') {
          if (password === '2526') {
            onLoginSuccess('admin');
            onClose();
            return;
          } else {
            throw new Error('Invalid admin credentials');
          }
        }

        // Customer Login Check
        const userExists = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (userExists) {
          if (userExists.password && userExists.password !== password) {
             throw new Error('Invalid email or password.');
          }
          if (userExists.status === 'pending') {
             throw new Error('Your account is waiting for admin approval.');
          }
          onLoginSuccess('customer', userExists);
          onClose();
        } else {
          throw new Error('Account not found. Please register first.');
        }
      } 
      
      // ==========================================
      // REGISTER
      // ==========================================
      else if (mode === 'register') {
        if (!name || !email || !password || !recoveryKey) throw new Error('Please fill in all fields');
        
        if (storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Email already registered. Please sign in.');
        }

        const newUser = {
          name,
          email,
          password,
          recoveryKey: recoveryKey.trim(), // Store the recovery key
          joinedAt: new Date().toISOString(),
          status: 'pending'
        };

        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('realview_users', JSON.stringify(updatedUsers));

        setSuccess('Registration successful! Please wait for admin approval.');
        setMode('signin');
        setName('');
        setPassword('');
        setRecoveryKey('');
      }

      // ==========================================
      // FORGOT PASSWORD: REQUEST (Check Email & Key)
      // ==========================================
      else if (mode === 'forgot-request') {
        if (!email || !recoveryKey) throw new Error('Please fill in all fields');

        const userExists = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (!userExists) {
          throw new Error('No account found with this email.');
        }

        // Verify Recovery Key
        if (!userExists.recoveryKey || userExists.recoveryKey.toLowerCase() !== recoveryKey.trim().toLowerCase()) {
           // Fallback for old users who might not have a key, or wrong key
           if (!userExists.recoveryKey) {
             throw new Error('This account has no recovery key set. Contact Admin.');
           }
           throw new Error('Invalid Recovery Key.');
        }

        setVerifiedUser(userExists);
        setSuccess('Identity verified.');
        setMode('forgot-reset');
      }

      // ==========================================
      // FORGOT PASSWORD: RESET PASSWORD
      // ==========================================
      else if (mode === 'forgot-reset') {
        if (!newPassword) throw new Error('Please enter a new password');
        if (newPassword.length < 4) throw new Error('Password must be at least 4 characters');

        // Update User Password
        const updatedUsers = storedUsers.map((u: any) => {
          if (u.email.toLowerCase() === verifiedUser.email.toLowerCase()) {
            return { ...u, password: newPassword };
          }
          return u;
        });

        localStorage.setItem('realview_users', JSON.stringify(updatedUsers));

        setSuccess('Password reset successfully! Please sign in.');
        setTimeout(() => {
          switchMode('signin');
          setPassword(''); 
        }, 1500);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch(mode) {
      case 'signin': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'forgot-request': return 'Recover Account';
      case 'forgot-reset': return 'New Password';
      default: return 'Authentication';
    }
  };

  const getSubtitle = () => {
    switch(mode) {
      case 'signin': return 'Enter your credentials to access your workspace';
      case 'register': return 'Start capturing professional 3D tours today';
      case 'forgot-request': return 'Verify your identity to reset password';
      case 'forgot-reset': return 'Create a strong password for your account';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              {getTitle()}
            </h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {getSubtitle()}
            </p>
          </div>

          {/* DEV MODE QUICK ACCESS - TEMPORARY */}
          <button 
            onClick={handleDevBypass}
            className="w-full mb-6 py-3 bg-cyan-50 text-cyan-700 rounded-xl font-black text-[10px] uppercase tracking-widest border border-cyan-100 flex items-center justify-center gap-2 hover:bg-cyan-100 transition-colors"
          >
            <FlaskConical size={14} /> Bypass Auth (Dev Test Mode)
          </button>

          {/* Tab Switcher (Only for Sign In / Register) */}
          {(mode === 'signin' || mode === 'register') && (
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button 
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
              <button 
                onClick={() => switchMode('signin')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'signin' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center gap-2 border border-green-100">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* FULL NAME (Register only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* EMAIL (Signin, Register, Forgot-Request) */}
            {(mode === 'signin' || mode === 'register' || mode === 'forgot-request') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="name@company.com"
                    autoFocus={mode === 'forgot-request'}
                  />
                </div>
              </div>
            )}

            {/* PASSWORD (Signin, Register) */}
            {(mode === 'signin' || mode === 'register') && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                  {mode === 'signin' && (
                    <span 
                      onClick={() => switchMode('forgot-request')}
                      className="text-[10px] font-bold text-brand-600 cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {mode === 'register' && (
                   <p className="text-[10px] text-slate-400 pl-1">Create a password to protect your tours.</p>
                )}
              </div>
            )}

            {/* RECOVERY KEY (Register, Forgot-Request) */}
            {(mode === 'register' || mode === 'forgot-request') && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                     {mode === 'register' ? 'Create Recovery Key' : 'Enter Recovery Key'}
                  </label>
                </div>
                <div className="relative">
                  <ShieldQuestion className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="e.g. Pet's Name, PIN, Childhood City"
                  />
                </div>
                {mode === 'register' && (
                   <p className="text-[10px] text-slate-400 pl-1">Used to reset your password if you forget it.</p>
                )}
              </div>
            )}

            {/* NEW PASSWORD (Forgot-Reset) */}
            {mode === 'forgot-reset' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">New Password</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-brand-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot-request' && 'Verify Identity'}
                  {mode === 'forgot-reset' && 'Reset Password'}
                  {(mode === 'register' || mode === 'signin') && <ArrowRight size={18} />}
                  {mode === 'forgot-request' && <CheckCircle2 size={16} />}
                  {mode === 'forgot-reset' && <Key size={16} />}
                </>
              )}
            </button>
            
            {/* BACK BUTTON (For Forgot Flow) */}
            {(mode === 'forgot-request' || mode === 'forgot-reset') && (
               <button 
                type="button"
                onClick={() => switchMode('signin')}
                className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold text-xs transition-colors flex items-center justify-center gap-2"
               >
                 <ArrowLeft size={14} /> Back to Sign In
               </button>
            )}

          </form>

          {/* FOOTER */}
          {(mode === 'signin' || mode === 'register') && (
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                By continuing, you agree to our <span className="text-slate-900 font-bold cursor-pointer">Terms</span> and <span className="text-slate-900 font-bold cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
