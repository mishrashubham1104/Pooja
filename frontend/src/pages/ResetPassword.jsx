import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle, Phone } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mobile, setMobile] = useState(searchParams.get('mobile') || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Invalid mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'OTP verification failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    if (pwd.length < 6) return { level: 1, label: 'Too short', color: 'bg-red-400' };
    if (pwd.length < 8) return { level: 2, label: 'Weak', color: 'bg-orange-400' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { level: 4, label: 'Strong', color: 'bg-green-500' };
    return { level: 3, label: 'Medium', color: 'bg-yellow-400' };
  };
  const strength = getStrength(newPassword);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#800000] to-[#c05c29] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold">Verify & Reset</h1>
          <p className="text-white/70 text-sm mt-2">Enter the OTP sent to your mobile and set a new password</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* Success */}
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-5 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>
                <h2 className="text-xl font-extrabold text-gray-900">Password Reset! 🎉</h2>
                <p className="text-gray-500 text-sm">Your password has been updated successfully.</p>
                <p className="text-gray-400 text-xs">Redirecting to login in 3 seconds...</p>
                <Link to="/login" className="inline-block bg-gradient-to-r from-[#800000] to-[#c05c29] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md">
                  Login Now →
                </Link>
              </motion.div>
            ) : (

              /* Form */
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all bg-gray-50 font-semibold tracking-wide text-gray-700 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-saffron-600 font-medium mt-1 text-right max-w-full">
                    <Link to="/forgot-password" className="hover:underline">Change Mobile Number</Link>
                  </p>
                </div>

                {/* Token */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">OTP (6-digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={token}
                    onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
                    placeholder="_ _ _ _ _ _"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all text-center text-2xl font-bold tracking-[0.4em] text-maroon-600"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-gray-100'}`} />
                        ))}
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength.level <= 1 ? 'text-red-400' : strength.level === 2 ? 'text-orange-400' : strength.level === 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all ${
                      confirmPassword && newPassword !== confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || token.length !== 6 || (confirmPassword && newPassword !== confirmPassword)}
                  className="w-full bg-gradient-to-r from-[#800000] to-[#c05c29] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying...</>
                  ) : (
                    <><KeyRound className="w-5 h-5" /> Reset Password</>
                  )}
                </button>

                <div className="text-center text-sm text-gray-500">
                  <Link to="/login" className="text-saffron-600 font-semibold hover:underline">Back to Login</Link>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
