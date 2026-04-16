import { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

const availableTimeSlots = [
   "08:00 AM - 10:00 AM",
   "10:00 AM - 12:00 PM",
   "04:00 PM - 06:00 PM"
];

export default function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const typeParam = queryParams.get('type');

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Form State
  const [form, setForm] = useState({ date: '', timeSlot: '', address: '', instructions: '', poojaType: typeParam || '' });
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj.role === 'pandit') {
        navigate('/dashboard/pandit');
        return;
      }
    }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/${id}`)
      .then(res => {
         if (!res.ok) throw new Error('Failed to fetch');
         return res.json();
      })
      .then(data => {
         setProfile(data);
         if (!typeParam && data.specialization && data.specialization.length > 0) {
            setForm(prev => ({ ...prev, poojaType: data.specialization[0] }));
         }
         setLoading(false);
      })
      .catch(err => {
         console.error('Error fetching profile:', err);
         setLoading(false);
      });
  }, [id, typeParam]);

  useEffect(() => {
     if (form.date && profile?.user?._id) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/slots/${profile.user._id}?date=${form.date}`)
           .then(res => res.json())
           .then(data => {
              setBookedSlots(data);
              if(data.includes(form.timeSlot)) setForm(prev => ({...prev, timeSlot: ''}));
           })
           .catch(err => console.error("Failed to fetch slots", err));
     } else {
        setBookedSlots([]);
     }
  }, [form.date, profile, form.timeSlot]);

  const handleNext = (e) => { 
     e.preventDefault(); 
     const token = localStorage.getItem('token');
     if(!token) {
         alert("Please login to proceed with booking.");
         navigate('/login');
         return;
     }
     setStep(2); 
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to proceed with booking.");
        navigate('/login');
        return;
    }
    
    if(!form.timeSlot) {
      alert("Please select a time slot");
      return;
    }

    try {
       const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
             panditId: profile.user._id,
             poojaType: form.poojaType || 'General Pooja',
             date: form.date,
             timeSlot: form.timeSlot,
             address: form.address,
             specialInstructions: form.instructions || '',
             totalAmount: (profile?.charges || 1100) + 100
          })
       });

       const data = await response.json();
       if(response.ok) {
          setComplete(true);
       } else {
          alert(`Booking failed: ${data.message}`);
       }
    } catch(err) {
       console.error(err);
       alert("An error occurred while booking. Please try again.");
    }
  };

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-saffron-600 font-medium">Loading Booking Details...</div>;
  if (!profile) return <div className="min-h-[80vh] flex items-center justify-center text-maroon-600 font-bold text-xl">Pandit profile not found.</div>;

  const basePrice = profile.charges || 1100;
  const convenienceFee = 100;
  const totalPrice = basePrice + convenienceFee;

  // Today's date in YYYY-MM-DD for min restriction
  const today = new Date().toISOString().split('T')[0];

  if (complete) {
     return (
        <div className="min-h-[80vh] flex items-center justify-center bg-cream-50 px-4">
           <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-saffron-100">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-maroon-600 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-8">Your pooja has been successfully booked with {profile.user?.name}.</p>
              
              <div className="bg-gray-50 p-4 rounded-xl text-left mb-8 text-sm text-gray-700">
                 <div className="flex justify-between mb-2"><span>Booking ID:</span> <span className="font-bold">#PJ-84920</span></div>
                 <div className="flex justify-between mb-2"><span>Date:</span> <span className="font-bold">{form.date || 'Tomorrow'}</span></div>
                 <div className="flex justify-between"><span>Time:</span> <span className="font-bold">{form.timeSlot || '09:00 AM'}</span></div>
              </div>

              <Link to="/dashboard/customer" className="block w-full py-3 bg-saffron-500 text-white font-bold rounded-lg hover:bg-saffron-600 shadow-md">Go to Dashboard</Link>
           </div>
        </div>
     );
  }

  return (
    <div className="bg-cream-50 min-h-[80vh] py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
         
         <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-maroon-600 mb-6 border-b pb-4">
               {step === 1 ? 'Booking Details' : 'Payment & Confirmation'}
            </h1>

            {step === 1 ? (
               <form onSubmit={handleNext} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Pooja</label>
                    <select value={form.poojaType} onChange={e => setForm({...form, poojaType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none">
                       {profile.specialization && profile.specialization.length > 0 ? (
                           profile.specialization.map(t => (
                              <option key={t} value={t}>{t}</option>
                           ))
                       ) : (
                           <option value="General Pooja">General Pooja</option>
                       )}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2"><Calendar className="inline w-4 h-4 mr-1 text-gray-400"/> Date</label>
                       <input type="date" required min={today} value={form.date} onChange={e => {
                        if (e.target.value < today) return;
                        setForm({...form, date: e.target.value});
                      }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                      {form.date && form.date < today && <p className="text-red-500 text-xs mt-1">You cannot book for a past date.</p>}
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2"><Clock className="inline w-4 h-4 mr-1 text-gray-400"/> Time Slot</label>
                       <select required disabled={!form.date} value={form.timeSlot} onChange={e => setForm({...form, timeSlot: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none disabled:bg-gray-100 disabled:opacity-75">
                          <option value="">{form.date ? 'Select Time' : 'Select a date first'}</option>
                          {availableTimeSlots.map(slot => (
                              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                                  {slot} {bookedSlots.includes(slot) ? '(Already Booked)' : ''}
                              </option>
                          ))}
                       </select>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2"><MapPin className="inline w-4 h-4 mr-1 text-gray-400"/> Event Address</label>
                    <textarea required rows="2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" placeholder="Enter complete address"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-maroon-600 text-white font-bold py-4 rounded-xl hover:bg-maroon-700 shadow-md">Proceed to Payment</button>
               </form>
            ) : (
               <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm flex gap-3">
                     <CreditCard className="w-5 h-5 flex-shrink-0" />
                     <p>You can pay instantly using our secure PG or opt to pay directly to the Pandit Ji after the service.</p>
                  </div>
                  
                  <div className="space-y-4">
                     <label className="flex items-center gap-3 p-4 border border-saffron-500 bg-saffron-50 rounded-xl cursor-pointer shadow-sm">
                        <input type="radio" name="payment" defaultChecked className="accent-saffron-600 w-5 h-5" />
                        <span className="font-semibold text-gray-900">Pay Online via UPI / Card</span>
                     </label>
                     <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="payment" className="accent-saffron-600 w-5 h-5" />
                        <span className="font-semibold text-gray-900">Cash on Service</span>
                     </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button onClick={() => setStep(1)} className="flex-1 py-4 text-gray-600 font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Back</button>
                     <button onClick={handleConfirm} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md">Confirm & Pay ₹{totalPrice}</button>
                  </div>
               </div>
            )}
         </div>

         <aside>
            <div className="bg-white rounded-2xl shadow-sm border border-saffron-200 p-6 sticky top-24">
               <h3 className="font-bold text-lg text-gray-900 mb-4 pb-4 border-b">Order Summary</h3>
               
               <div className="flex items-center gap-3 mb-6">
                  <img src={profile.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.user?.name}&backgroundColor=fce8db&textColor=854d0e`} alt={profile.user?.name} className="w-12 h-12 rounded-full border border-gray-200 bg-saffron-50 object-cover" />
                  <div>
                     <div className="font-bold text-gray-900">{profile.user?.name}</div>
                     <div className="text-xs text-gray-500">{profile.city}</div>
                  </div>
               </div>

               <div className="space-y-3 text-sm text-gray-600 mb-6 border-b pb-6">
                  <div className="flex justify-between"><span>Service Name</span> <span className="font-semibold text-gray-900">{form.poojaType || 'General Pooja'}</span></div>
                  <div className="flex justify-between"><span>Base Price</span> <span className="font-semibold text-gray-900">₹{basePrice}</span></div>
                  <div className="flex justify-between"><span>Samagri Addon</span> <span className="font-semibold text-gray-900">₹0</span></div>
                  <div className="flex justify-between"><span>Convenience Fee</span> <span className="font-semibold text-gray-900">₹{convenienceFee}</span></div>
               </div>

               <div className="flex justify-between items-center text-lg font-bold text-maroon-600">
                  <span>Total Amount</span>
                  <span>₹{totalPrice}</span>
               </div>
            </div>
         </aside>

      </div>
    </div>
  );
}
