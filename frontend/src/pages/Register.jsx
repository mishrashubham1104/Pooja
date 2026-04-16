import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [isPandit, setIsPandit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobile: '', 
    city: '', experience: '', specialization: '', charges: '', bio: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    
    try {
      const payload = { ...formData, role: isPandit ? 'pandit' : 'customer' };
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-saffron-100">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🕉️</div>
          <h2 className="text-3xl font-bold text-maroon-600">Create an Account</h2>
          <p className="text-gray-500 mt-2">Join Pooja Connect Today</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
           <button 
             className={`flex-1 py-2 font-medium rounded-md transition-all ${!isPandit ? 'bg-white shadow-sm text-maroon-600' : 'text-gray-500'}`}
             onClick={() => setIsPandit(false)}
           >Customer</button>
           <button 
             className={`flex-1 py-2 font-medium rounded-md transition-all ${isPandit ? 'bg-saffron-500 text-white shadow-sm' : 'text-gray-500'}`}
             onClick={() => setIsPandit(true)}
           >Pandit</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="name" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500" placeholder="Shriram Sharma" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500" placeholder="you@example.com" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input required type="text" name="mobile" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500" placeholder="9876543210" />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input required type="password" name="password" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-saffron-500" placeholder="••••••••" />
             </div>
           </div>

           {isPandit && (
             <div className="pt-6 mt-6 border-t border-gray-200">
               <h3 className="text-xl font-bold text-gray-800 mb-4">Pandit Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                    <input required type="text" name="city" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Varanasi, UP" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <input required type="number" name="experience" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="10" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization (Poojas)</label>
                    <input required type="text" name="specialization" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="e.g. Satyanarayan Pooja, Griha Pravesh" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                    <textarea rows="3" name="bio" onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Describe your background and expertise..."></textarea>
                  </div>
               </div>
             </div>
           )}

           {/* Terms & Conditions Checkbox */}
           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
             <label className="flex items-start gap-3 cursor-pointer">
               <input
                 type="checkbox"
                 checked={agreeTerms}
                 onChange={e => setAgreeTerms(e.target.checked)}
                 className="accent-saffron-500 w-5 h-5 mt-0.5 flex-shrink-0"
               />
               <span className="text-sm text-gray-600 leading-relaxed">
                 I have read and agree to the{' '}
                 <Link to="/terms" target="_blank" className="text-saffron-600 font-semibold hover:underline">Terms of Service</Link>{' '}
                 and{' '}
                 <Link to="/privacy" target="_blank" className="text-saffron-600 font-semibold hover:underline">Privacy Policy</Link> of Pooja Connect.
               </span>
             </label>
           </div>

           <button 
             type="submit" 
             disabled={isLoading || !agreeTerms}
             className={`w-full font-bold py-4 rounded-lg text-white transition-colors shadow-md ${isPandit ? 'bg-saffron-500 hover:bg-saffron-600' : 'bg-maroon-600 hover:bg-maroon-700'} ${(isLoading || !agreeTerms) ? 'opacity-70 cursor-not-allowed' : ''}`}
           >
             {isLoading ? 'Processing...' : (isPandit ? 'Register as Pandit' : 'Create Account')}
           </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-saffron-600 hover:text-saffron-700">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
