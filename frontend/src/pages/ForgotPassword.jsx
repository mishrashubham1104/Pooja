import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, KeyRound, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (data.resetToken) {
        setResetToken(data.resetToken);
      } else {
        // Mobile not found — still show generic message (security)
        setResetToken('NOT_FOUND');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(resetToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#800000] to-[#c05c29] p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold">Forgot Password?</h1>
          <p className="text-white/70 text-sm mt-2">Enter your registered mobile number to get an OTP</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* Step 1: Enter mobile */}
            {!resetToken && (
              <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {error && (
                  <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 transition-all font-bold tracking-wide"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="w-full bg-gradient-to-r from-[#800000] to-[#c05c29] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating...</>
                    ) : (
                      <><ArrowRight className="w-5 h-5" /> Generate OTP</>
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                  Remembered it?{' '}
                  <Link to="/login" className="text-saffron-600 font-semibold hover:underline">Back to Login</Link>
                </div>
              </motion.div>
            )}

            {/* Step 2: Show token */}
            {resetToken && resetToken !== 'NOT_FOUND' && (
              <motion.div key="token" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-green-700 font-semibold text-sm">Your OTP is ready!</p>
                  <p className="text-green-600 text-xs mt-1">Valid for 15 minutes only</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your 6-Digit OTP</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-center">
                      <span className="text-3xl font-extrabold tracking-[0.3em] text-maroon-600">{resetToken}</span>
                    </div>
                    <button
                      onClick={copyToken}
                      className={`p-3 rounded-xl border transition-all ${copied ? 'bg-green-50 border-green-300 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-saffron-300'}`}
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">📋 Copy this OTP and use it to reset your password</p>
                </div>

                <Link
                  to={`/reset-password?mobile=${encodeURIComponent(mobile)}`}
                  onClick={() => copyToken()}
                  className="w-full bg-gradient-to-r from-[#800000] to-[#c05c29] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-5 h-5" /> Set New Password →
                </Link>
              </motion.div>
            )}

            {/* Mobile not found */}
            {resetToken === 'NOT_FOUND' && (
              <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                <div className="text-4xl">📭</div>
                <p className="text-gray-600 font-medium">If that mobile is registered, an OTP has been generated.</p>
                <p className="text-gray-400 text-sm">Please check if you used the correct mobile number.</p>
                <button onClick={() => setResetToken('')} className="text-saffron-600 font-semibold hover:underline text-sm">Try again</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
