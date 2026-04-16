import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, CheckSquare, DollarSign, UserCircle, Save, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PanditDashboard() {
   const [activeTab, setActiveTab] = useState('overview');
   const [bookings, setBookings] = useState([]);
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   
   // Form state
   const [form, setForm] = useState({ name: '', city: '', bio: '', charges: '', experience: '', specialization: '', languages: '' });
   const [saving, setSaving] = useState(false);

   const navigate = useNavigate();

   const storedUser = localStorage.getItem('user');
   const user = storedUser ? JSON.parse(storedUser) : { name: 'Pandit' };

   useEffect(() => {
     const handleTabUpdate = (e) => setActiveTab(e.detail);
     window.addEventListener('changeDashboardTab', handleTabUpdate);
     return () => window.removeEventListener('changeDashboardTab', handleTabUpdate);
   }, []);

   const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
         const resBook = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
         });
         if(resBook.ok) setBookings(await resBook.json());

         const resProf = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
         });
         if(resProf.ok) {
            const data = await resProf.json();
            setProfile(data);
            setForm({
               name: data.user?.name || '',
               city: data.city || '',
               bio: data.bio || '',
               charges: data.charges || '',
               experience: data.experience || '',
               specialization: data.specialization?.join(', ') || '',
               languages: data.languages?.join(', ') || ''
            });
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, [navigate]);

   const updateBookingStatus = async (id, status) => {
      const token = localStorage.getItem('token');
      try {
         const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}/status`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
         });
         if (res.ok) {
            fetchData(); // refresh list
         }
      } catch (err) {
         console.error("Failed to update status", err);
      }
   };

   const saveProfile = async (e) => {
       e.preventDefault();
       setSaving(true);
       const token = localStorage.getItem('token');
       try {
           const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/me`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(form)
           });
           if(res.ok) {
              alert("Profile updated successfully!");
              fetchData();
           } else {
              alert("Error updating profile.");
           }
       } catch (err) {
           console.error(err);
       } finally {
           setSaving(false);
       }
   };

   const formatDate = (dateStr) => {
       return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'short' });
   };

   // Metrics
   const completedBookings = bookings.filter(b => b.status === 'completed');
   const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
   const upcomingPoojas = bookings.filter(b => b.status === 'confirmed');
   const newRequests = bookings.filter(b => b.status === 'pending');

   if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Dashboard...</div>;

   return (
      <div className="bg-gray-50 min-h-[80vh] flex relative">
         {/* Sidebar */}
         <aside className="w-64 bg-[#1E293B] text-white hidden md:block flex-shrink-0">
            <div className="p-6 border-b border-gray-700 text-center">
               <img src={profile?.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=fce8db&textColor=854d0e`} alt={user.name} className="w-16 h-16 rounded-full border-2 border-saffron-500 mx-auto mb-3 bg-saffron-50 object-cover" />
               <h3 className="font-bold">{profile?.user?.name || user.name}</h3>
               {profile?.isVerified && <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 mt-2 inline-block">Verified Pandit</span>}
            </div>
            <nav className="p-4 space-y-2 overflow-y-auto">
               {[
                  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard Overview' },
                  { id: 'requests', icon: CheckSquare, label: 'Booking Requests' },
                  { id: 'calendar', icon: CalendarIcon, label: 'Availability Calendar' },
                  { id: 'earnings', icon: DollarSign, label: 'Earnings Summary' },
                  { id: 'profile', icon: UserCircle, label: 'Manage Profile' }
               ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
                        ${activeTab === tab.id ? 'bg-saffron-500 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800'}`}>
                     <tab.icon className="w-5 h-5" /> {tab.label}
                  </button>
               ))}
            </nav>
         </aside>

         {/* Content */}
         <main className="flex-1 p-4 md:p-8 min-w-0">
            <header className="flex justify-between items-center mb-8">
               <h1 className="text-2xl font-bold text-gray-800 capitalize">Pandit {activeTab.replace('-', ' ')}</h1>
            </header>

            {activeTab === 'overview' && (
               <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                     {[
                        { label: 'Total Earnings', value: `₹${totalEarnings}`, color: 'border-green-500', text: 'text-green-600' },
                        { label: 'Upcoming Confirmed', value: upcomingPoojas.length, color: 'border-blue-500', text: 'text-blue-600' },
                        { label: 'Pending Requests', value: newRequests.length, color: 'border-saffron-500', text: 'text-saffron-600' },
                        { label: 'Average Rating', value: `${profile?.rating || 'New'} ★`, color: 'border-gold-500', text: 'text-gold-600' }
                     ].map(stat => (
                        <div key={stat.label} className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.color}`}>
                           <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                           <h3 className={`text-3xl font-bold ${stat.text}`}>{stat.value}</h3>
                        </div>
                     ))}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                     <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 text-lg">Recent Booking Requests</h3>
                        <button onClick={() => setActiveTab('requests')} className="text-saffron-600 text-sm font-medium hover:underline">View All</button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                           <thead>
                              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                 <th className="p-4 font-medium">Customer</th>
                                 <th className="p-4 font-medium">Pooja Type</th>
                                 <th className="p-4 font-medium">Date & Time</th>
                                 <th className="p-4 font-medium">Amount</th>
                                 <th className="p-4 font-medium">Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {newRequests.length === 0 ? (
                                  <tr>
                                      <td colSpan="5" className="p-8 text-center text-gray-500 italic">No new pending requests right now.</td>
                                  </tr>
                              ) : newRequests.slice(0, 5).map(req => (
                                <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50">
                                   <td className="p-4 font-medium text-gray-900">{req.customer?.name}</td>
                                   <td className="p-4 text-gray-600">{req.poojaType}</td>
                                   <td className="p-4 text-gray-600">{formatDate(req.date)}, {req.timeSlot}</td>
                                   <td className="p-4 font-bold text-gray-900">₹{req.totalAmount}</td>
                                   <td className="p-4 flex gap-2">
                                      <button onClick={() => updateBookingStatus(req._id, 'confirmed')} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200">Accept</button>
                                      <button onClick={() => updateBookingStatus(req._id, 'cancelled')} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200">Reject</button>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-4xl">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-4">Manage Bookings</h3>
                    
                    {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length === 0 ? (
                         <div className="text-center py-12 text-gray-500 italic">No active bookings to manage.</div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').map(b => (
                                <div key={b._id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border border-gray-200 p-5 rounded-xl">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-lg text-gray-900">{b.poojaType}</h4>
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${b.status === 'pending' ? 'bg-saffron-100 text-saffron-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {b.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div><span className="font-semibold">Customer:</span> {b.customer?.name} ({b.customer?.mobile || 'No Mobile'})</div>
                                            <div><span className="font-semibold">Address:</span> {b.address}</div>
                                            <div className="flex gap-4 mt-2 font-medium text-gray-800 border-t pt-2 max-w-md">
                                                <div className="flex items-center gap-1"><CalendarIcon className="w-4 h-4 text-saffron-500"/> {formatDate(b.date)}</div>
                                                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-saffron-500"/> {b.timeSlot}</div>
                                                <div className="font-bold text-maroon-600">₹{b.totalAmount}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-row md:flex-col gap-2">
                                        {b.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateBookingStatus(b._id, 'confirmed')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 w-full text-center">Confirm Date</button>
                                                <button onClick={() => updateBookingStatus(b._id, 'cancelled')} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 w-full text-center">Decline</button>
                                            </>
                                        )}
                                        {b.status === 'confirmed' && (
                                            <button onClick={() => updateBookingStatus(b._id, 'completed')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 w-full text-center flex items-center justify-center gap-2">
                                               <CheckCircle className="w-4 h-4" /> Mark Completed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'calendar' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl">
                    <div className="bg-saffron-50/50 p-6 border-b border-gray-100 flex items-center gap-3">
                        <CalendarIcon className="text-saffron-600 w-6 h-6" />
                        <h3 className="font-bold text-lg text-gray-800">Your Upcoming Schedule</h3>
                    </div>
                    <div className="p-6">
                        {upcomingPoojas.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 italic">No confirmed upcoming poojas on your calendar.</div>
                        ) : (
                            <div className="space-y-6 flex flex-col">
                                {upcomingPoojas.sort((a,b)=> new Date(a.date) - new Date(b.date)).map(p => (
                                    <div key={p._id} className="flex gap-6 items-start border-l-2 border-saffron-400 pl-4">
                                        <div className="w-24 flex-shrink-0 text-center">
                                            <div className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-1 mb-1">{formatDate(p.date)}</div>
                                            <div className="text-xs font-semibold text-saffron-600">{p.timeSlot}</div>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex-1 hover:shadow-sm transition-shadow">
                                            <h4 className="font-bold text-gray-900">{p.poojaType}</h4>
                                            <p className="text-sm text-gray-600 mt-1">For {p.customer?.name} at {p.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'earnings' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 bg-green-50/30 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl"><DollarSign /></div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Total Lifetime Earnings</h3>
                            <div className="text-sm text-gray-500">Based on manually completed cash transactions</div>
                        </div>
                        <div className="ml-auto text-3xl font-black text-green-600">₹{totalEarnings}</div>
                    </div>
                    <div className="p-6">
                        {completedBookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 italic">No completed payment history yet.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold uppercase">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Date</th>
                                            <th className="px-4 py-3">Pooja Delivered</th>
                                            <th className="px-4 py-3">Customer</th>
                                            <th className="px-4 py-3 rounded-r-lg text-right">Cash Received</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {completedBookings.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(b => (
                                            <tr key={b._id} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-4">{formatDate(b.date)}</td>
                                                <td className="px-4 py-4 font-medium text-gray-900">{b.poojaType}</td>
                                                <td className="px-4 py-4 text-gray-600">{b.customer?.name}</td>
                                                <td className="px-4 py-4 text-right font-bold text-green-600">₹{b.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl">
                    <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-4 flex items-center gap-2"><UserCircle /> Manage Your Public Profile</h3>
                    
                    <form onSubmit={saveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
                                <input type="text" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Base Charges (₹)</label>
                                <input type="number" required value={form.charges} onChange={e=>setForm({...form, charges: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">City/Location</label>
                                <input type="text" required value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years)</label>
                                <input type="number" required value={form.experience} onChange={e=>setForm({...form, experience: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Poojas Offered <span className="text-gray-400 font-normal">(Comma separated)</span></label>
                            <input type="text" placeholder="e.g. Satyanarayan Pooja, Griha Pravesh" value={form.specialization} onChange={e=>setForm({...form, specialization: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Languages <span className="text-gray-400 font-normal">(Comma separated)</span></label>
                            <input type="text" placeholder="e.g. Hindi, Sanskrit, English" value={form.languages} onChange={e=>setForm({...form, languages: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pandit Bio</label>
                            <textarea rows="4" value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-saffron-500 focus:outline-none" placeholder="Describe your background and expertise..."></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button type="submit" disabled={saving} className="bg-saffron-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-saffron-700 transition-colors flex items-center gap-2">
                                {saving ? "Saving..." : <><Save className="w-5 h-5"/> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}
         </main>
      </div>
   )
}
