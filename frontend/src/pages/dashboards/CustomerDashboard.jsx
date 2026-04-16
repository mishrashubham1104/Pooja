import { useState, useEffect } from 'react';
import { User, Calendar, Clock, CreditCard, Star, MapPin, Heart, TrendingUp, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const tabConfig = [
  { id: 'profile', icon: User, label: 'My Profile', emoji: '👤' },
  { id: 'bookings', icon: Calendar, label: 'My Bookings', emoji: '📅' },
  { id: 'history', icon: CreditCard, label: 'Payments', emoji: '💳' },
  { id: 'favorites', icon: Heart, label: 'Favorites', emoji: '❤️' },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fullUser, setFullUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Customer' };

  useEffect(() => {
    const handleTabUpdate = (e) => setActiveTab(e.detail);
    window.addEventListener('changeDashboardTab', handleTabUpdate);
    return () => window.removeEventListener('changeDashboardTab', handleTabUpdate);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const [resBookings, resUser] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (resBookings.ok) setBookings(await resBookings.json());
        if (resUser.ok) {
          const userData = await resUser.json();
          setFullUser(userData);
          setFavorites(userData.favoritePandits || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
    if (bookingTab === 'completed') return b.status === 'completed';
    if (bookingTab === 'cancelled') return b.status === 'cancelled';
    return false;
  });

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'C';

  // Animated page transition wrapper
  const TabPanel = ({ children }) => (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Profile Header Banner */}
      <div className="relative">
        <div className="h-48 md:h-56 bg-gradient-to-r from-[#800000] via-[#c05c29] to-[#e86424] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h4v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2H22v2H0v-2h20\' fill=\'%23ffffff\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fdfbf7] to-transparent" />
        </div>

        {/* Profile Card on banner */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullUser?.name || user.name}&backgroundColor=fce8db&textColor=854d0e`}
                  alt={user.name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-xl bg-saffron-50"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{fullUser?.name || user.name}</h1>
                <p className="text-saffron-600 font-medium mt-0.5">{fullUser?.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3 flex-wrap">
                  <span className="bg-saffron-50 text-saffron-700 text-xs font-bold px-3 py-1 rounded-full border border-saffron-200 capitalize">{user.role || 'Customer'}</span>
                  {fullUser?.mobile && (
                    <span className="text-gray-500 text-sm">📱 {fullUser.mobile}</span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-100 rounded-2xl px-5 py-3 text-center min-w-[90px]">
                  <div className="text-2xl font-extrabold text-saffron-600">{bookings.length}</div>
                  <div className="text-xs text-gray-500 font-medium">Bookings</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl px-5 py-3 text-center min-w-[90px]">
                  <div className="text-2xl font-extrabold text-green-600">₹{totalSpent}</div>
                  <div className="text-xs text-gray-500 font-medium">Spent</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl px-5 py-3 text-center min-w-[90px]">
                  <div className="text-2xl font-extrabold text-red-500">{favorites.length}</div>
                  <div className="text-xs text-gray-500 font-medium">Favorites</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#800000] to-[#c05c29] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-base">{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
            <p className="text-saffron-600 font-medium">Loading your dashboard...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ─── My Profile ─── */}
            {activeTab === 'profile' && (
              <TabPanel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-saffron-500" /> Personal Information
                    </h2>
                    <div className="space-y-5">
                      {[
                        { label: 'Full Name', value: fullUser?.name, icon: '👤' },
                        { label: 'Email Address', value: fullUser?.email, icon: '📧' },
                        { label: 'Mobile Number', value: fullUser?.mobile || 'Not added yet', icon: '📱' },
                        { label: 'Account Type', value: fullUser?.role, icon: '🏷️' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50/70 rounded-xl p-4 border border-gray-100 hover:border-saffron-200 transition-colors">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{item.label}</div>
                            <div className="text-gray-800 font-medium capitalize">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#800000] to-[#c05c29] rounded-3xl p-7 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Activity Overview</h3>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="text-3xl font-extrabold">{bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}</div>
                          <div className="text-sm text-white/70 mt-1">Upcoming</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="text-3xl font-extrabold">{completedBookings.length}</div>
                          <div className="text-sm text-white/70 mt-1">Completed</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="text-3xl font-extrabold">{favorites.length}</div>
                          <div className="text-sm text-white/70 mt-1">Favorites</div>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                          <div className="text-3xl font-extrabold">₹{totalSpent}</div>
                          <div className="text-sm text-white/70 mt-1">Total Spent</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Link to="/pandits" className="flex items-center justify-between p-4 bg-saffron-50/50 hover:bg-saffron-50 rounded-xl border border-saffron-100 transition-colors group">
                          <span className="flex items-center gap-3 font-semibold text-gray-800"><BookOpen className="w-5 h-5 text-saffron-500" /> Book a New Pooja</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-saffron-500 transition-colors" />
                        </Link>
                        <button onClick={() => setActiveTab('favorites')} className="w-full flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 rounded-xl border border-red-100 transition-colors group">
                          <span className="flex items-center gap-3 font-semibold text-gray-800"><Heart className="w-5 h-5 text-red-400" /> View Favorite Pandits</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}

            {/* ─── My Bookings ─── */}
            {activeTab === 'bookings' && (
              <TabPanel>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Sub-tabs */}
                  <div className="flex border-b border-gray-100">
                    {['upcoming', 'completed', 'cancelled'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setBookingTab(tab)}
                        className={`flex-1 py-4 font-semibold capitalize text-sm transition-all ${
                          bookingTab === tab
                            ? 'text-saffron-600 border-b-3 border-saffron-500 bg-saffron-50/30'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {tab}
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          bookingTab === tab ? 'bg-saffron-100 text-saffron-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {bookings.filter(b => {
                            if (tab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
                            if (tab === 'completed') return b.status === 'completed';
                            return b.status === 'cancelled';
                          }).length}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6">
                    {filteredBookings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-500 font-medium">No {bookingTab} bookings found.</p>
                        {bookingTab === 'upcoming' && (
                          <Link to="/pandits" className="inline-block mt-4 text-saffron-600 font-bold hover:underline">Book your first Pooja →</Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredBookings.map((b, i) => (
                          <motion.div
                            key={b._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/80 border border-gray-100 p-5 rounded-2xl hover:border-saffron-200 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-saffron-100 to-orange-100 text-2xl rounded-2xl flex items-center justify-center">🕉️</div>
                              <div>
                                <h4 className="font-bold text-gray-900">{b.poojaType}</h4>
                                <p className="text-sm text-gray-500">with {b.pandit?.name || 'Pandit Ji'}</p>
                              </div>
                              <div className="hidden sm:block w-px h-10 bg-gray-200 mx-2"></div>
                              <div className="text-sm text-gray-600">
                                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-saffron-500" /> {formatDate(b.date)}</div>
                                <div className="flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-saffron-500" /> {b.timeSlot}</div>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-0 flex items-center gap-4">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {b.status.toUpperCase()}
                              </span>
                              <span className="text-lg font-extrabold text-maroon-600">₹{b.totalAmount}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
            )}

            {/* ─── Payment History ─── */}
            {activeTab === 'history' && (
              <TabPanel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
                    <TrendingUp className="w-8 h-8 mb-3 opacity-70" />
                    <div className="text-3xl font-extrabold">₹{totalSpent}</div>
                    <div className="text-sm text-green-100 mt-1">Total Amount Paid</div>
                  </div>
                  <div className="bg-gradient-to-br from-saffron-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg">
                    <Calendar className="w-8 h-8 mb-3 opacity-70" />
                    <div className="text-3xl font-extrabold">{completedBookings.length}</div>
                    <div className="text-sm text-orange-100 mt-1">Completed Poojas</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#800000] to-[#a52a2a] rounded-3xl p-6 text-white shadow-lg">
                    <CreditCard className="w-8 h-8 mb-3 opacity-70" />
                    <div className="text-3xl font-extrabold">{completedBookings.length > 0 ? `₹${Math.round(totalSpent / completedBookings.length)}` : '—'}</div>
                    <div className="text-sm text-red-100 mt-1">Average per Pooja</div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Payment Transactions</h2>
                    <p className="text-sm text-gray-500">All completed pooja payments</p>
                  </div>
                  <div className="p-6">
                    {completedBookings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-4">💳</div>
                        <p className="text-gray-500 font-medium">No payment history yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Service</th>
                              <th className="px-4 py-3">Pandit</th>
                              <th className="px-4 py-3">Method</th>
                              <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {completedBookings.map((b) => (
                              <tr key={b._id} className="hover:bg-saffron-50/20 transition-colors">
                                <td className="px-4 py-4 text-gray-600">{formatDate(b.date)}</td>
                                <td className="px-4 py-4 font-semibold text-gray-900">{b.poojaType}</td>
                                <td className="px-4 py-4 text-gray-600">{b.pandit?.name}</td>
                                <td className="px-4 py-4"><span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">CASH</span></td>
                                <td className="px-4 py-4 text-right font-extrabold text-maroon-600">₹{b.totalAmount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
            )}

            {/* ─── Favorite Pandits ─── */}
            {activeTab === 'favorites' && (
              <TabPanel>
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                      <Heart className="w-10 h-10 text-red-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">No Favorites Yet</h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6">You haven't added any pandits to your favorites.</p>
                    <Link to="/pandits" className="inline-block bg-gradient-to-r from-[#DA6626] to-[#c05c29] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity">
                      Browse Pandits
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav, i) => (
                      <motion.div
                        key={fav._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                      >
                        {/* Card Header */}
                        <div className="h-20 bg-gradient-to-r from-saffron-100 to-maroon-50 relative">
                          <div className="absolute top-3 right-3">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          </div>
                        </div>
                        <div className="px-6 pb-6 -mt-10 text-center">
                          <img
                            src={fav.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${fav.user?.name}&backgroundColor=fce8db&textColor=854d0e`}
                            alt={fav.user?.name}
                            className="w-20 h-20 rounded-2xl border-4 border-white bg-white shadow-md object-cover mx-auto mb-3"
                          />
                          <h3 className="font-bold text-gray-900 text-lg">{fav.user?.name}</h3>
                          {fav.city && (
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1"><MapPin className="w-3 h-3" />{fav.city}</p>
                          )}
                          {fav.specialization && fav.specialization.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 mt-3">
                              {fav.specialization.slice(0, 3).map((s) => (
                                <span key={s} className="text-[10px] bg-saffron-50 text-saffron-700 px-2 py-0.5 rounded-full border border-saffron-100 font-medium">{s}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 mt-5">
                            <Link to={`/pandit/${fav._id}`} className="flex-1 py-2 text-sm font-bold text-saffron-600 border border-saffron-200 rounded-xl hover:bg-saffron-50 transition-colors text-center">
                              View Profile
                            </Link>
                            <Link to={`/book/${fav._id}`} className="flex-1 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#800000] to-[#c05c29] rounded-xl hover:opacity-90 transition-opacity text-center shadow-sm">
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabPanel>
            )}

          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
