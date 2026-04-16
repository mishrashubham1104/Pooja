import { useState, useEffect, useMemo } from 'react';
import { Search, Star, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// All known pooja types for filters
const POOJA_TYPES = [
  'Satyanarayan Pooja',
  'Griha Pravesh',
  'Wedding Pooja',
  'Havan',
  'Navgraha Shanti',
  'Rudrabhishek',
  'Mundan',
  'Sunderkand Path',
];

export default function Pandits() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const serviceFromQuery = queryParams.get('service');
  const searchFromQuery = queryParams.get('q') || '';

  const [search, setSearch] = useState(searchFromQuery);
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCity, setSelectedCity] = useState(
    queryParams.get('city') || 'All Cities'
  );
  const [selectedPoojaTypes, setSelectedPoojaTypes] = useState(
    serviceFromQuery ? [serviceFromQuery] : []
  );
  const [minExperience, setMinExperience] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj.role === 'pandit') {
        navigate('/dashboard/pandit');
        return;
      }
    }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPandits(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching pandits:', err);
        setLoading(false);
      });
  }, [navigate]);

  // Build unique city list from actual data
  const cities = useMemo(() => {
    const citySet = new Set(pandits.map(p => p.city).filter(Boolean));
    return ['All Cities', ...Array.from(citySet).sort()];
  }, [pandits]);

  // Sync state with URL params if navigation happens while component is mounted
  useEffect(() => {
    const newCity = queryParams.get('city');
    if (newCity) setSelectedCity(newCity);
    
    const newService = queryParams.get('service');
    if (newService && !selectedPoojaTypes.includes(newService)) {
      setSelectedPoojaTypes(prev => [...prev.filter(t => t !== newService), newService]);
    }
    
    const newSearch = queryParams.get('q');
    if (newSearch !== null) setSearch(newSearch);
  }, [location.search]);

  // Build unique pooja types from actual data (merged with defaults)
  const availablePoojaTypes = useMemo(() => {
    const fromData = pandits.flatMap(p => p.specialization || []);
    const merged = new Set([...POOJA_TYPES, ...fromData]);
    return Array.from(merged).sort();
  }, [pandits]);

  // Toggle pooja type selection
  const togglePoojaType = (type) => {
    setSelectedPoojaTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCity('All Cities');
    setSelectedPoojaTypes([]);
    setMinExperience(0);
    setSearch('');
  };

  const hasActiveFilters = selectedCity !== 'All Cities' || selectedPoojaTypes.length > 0 || minExperience > 0 || search.length > 0;

  // Apply all filters
  const filteredPandits = useMemo(() => {
    return pandits.filter(p => {
      // Universal search — matches across name, city, and specialization
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = p.user?.name?.toLowerCase().includes(q);
        const cityMatch = p.city?.toLowerCase().includes(q);
        const poojaMatch = (p.specialization || []).some(s => s.toLowerCase().includes(q));
        if (!nameMatch && !cityMatch && !poojaMatch) return false;
      }

      // City dropdown filter
      if (selectedCity !== 'All Cities' && p.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;

      // Pooja type checkbox filter (pandit must offer at least one of the selected types)
      if (selectedPoojaTypes.length > 0) {
        const panditSpecs = (p.specialization || []).map(s => s.toLowerCase());
        const hasMatch = selectedPoojaTypes.some(type =>
          panditSpecs.some(spec => spec.includes(type.toLowerCase()) || type.toLowerCase().includes(spec))
        );
        if (!hasMatch) return false;
      }

      // Experience filter
      if (minExperience > 0 && (p.experience || 0) < minExperience) return false;

      return true;
    });
  }, [pandits, search, selectedCity, selectedPoojaTypes, minExperience]);

  // Filter panel content (shared between desktop sidebar and mobile drawer)
  const filterContent = (
    <>
      {/* Location */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">Location</label>
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 bg-white outline-none transition-all"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Pooja Type */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-3">Pooja Type</label>
        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {availablePoojaTypes.map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer text-gray-600 text-sm hover:text-gray-900 transition-colors group">
              <input
                type="checkbox"
                checked={selectedPoojaTypes.includes(t)}
                onChange={() => togglePoojaType(t)}
                className="accent-saffron-500 w-4 h-4 rounded"
              />
              <span className="group-hover:font-medium transition-all">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Experience {minExperience > 0 && <span className="text-saffron-600">({minExperience}+ yrs)</span>}
        </label>
        <input
          type="range"
          className="w-full accent-saffron-500 h-2 rounded-full"
          min="0"
          max="30"
          value={minExperience}
          onChange={e => setMinExperience(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 yrs</span>
          <span>30+ yrs</span>
        </div>
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {selectedCity !== 'All Cities' && (
              <span className="text-xs bg-saffron-50 text-saffron-700 px-2 py-1 rounded-full border border-saffron-200 flex items-center gap-1">
                📍 {selectedCity}
                <button onClick={() => setSelectedCity('All Cities')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedPoojaTypes.map(t => (
              <span key={t} className="text-xs bg-saffron-50 text-saffron-700 px-2 py-1 rounded-full border border-saffron-200 flex items-center gap-1">
                {t}
                <button onClick={() => togglePoojaType(t)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {minExperience > 0 && (
              <span className="text-xs bg-saffron-50 text-saffron-700 px-2 py-1 rounded-full border border-saffron-200 flex items-center gap-1">
                🕰️ {minExperience}+ yrs
                <button onClick={() => setMinExperience(0)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Clear */}
      <button
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        className={`w-full font-bold py-2.5 rounded-xl transition-colors ${
          hasActiveFilters
            ? 'bg-maroon-600 text-white hover:bg-maroon-700 shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Clear Filters
      </button>
    </>
  );

  return (
    <div className="bg-cream-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* ── Desktop Filters Sidebar ── */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-saffron-100 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-maroon-600 mb-6 text-xl">
              <Filter className="w-5 h-5" /> Filters
            </div>
            {filterContent}
          </div>
        </aside>

        {/* ── Mobile Filter Button ── */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-white border border-saffron-200 text-saffron-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm w-full justify-center"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-saffron-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {selectedPoojaTypes.length + (selectedCity !== 'All Cities' ? 1 : 0) + (minExperience > 0 ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* ── Mobile Filter Drawer ── */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
                  <h3 className="text-lg font-bold text-maroon-600 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filters
                  </h3>
                  <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  {filterContent}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full mt-3 bg-saffron-500 text-white font-bold py-3 rounded-xl hover:bg-saffron-600 shadow-md transition-colors"
                  >
                    Show {filteredPandits.length} Result{filteredPandits.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Pandits List ── */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Pandits</h1>
              <p className="text-gray-500 text-sm mt-1">
                Showing <span className="font-semibold text-saffron-600">{filteredPandits.length}</span> Pandit{filteredPandits.length !== 1 ? 's' : ''} matching your criteria
              </p>
            </div>
            <div className="flex bg-white rounded-xl border border-gray-200 px-4 py-2.5 w-full max-w-sm shadow-sm focus-within:border-saffron-400 focus-within:ring-2 focus-within:ring-saffron-100 transition-all">
              <Search className="text-gray-400 w-5 h-5 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name..."
                className="outline-none w-full bg-transparent text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active filters summary on desktop */}
          {hasActiveFilters && (
            <div className="hidden md:flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active:</span>
              {selectedCity !== 'All Cities' && (
                <span className="text-xs bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full border border-saffron-200 font-medium">📍 {selectedCity}</span>
              )}
              {selectedPoojaTypes.map(t => (
                <span key={t} className="text-xs bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full border border-saffron-200 font-medium">{t}</span>
              ))}
              {minExperience > 0 && (
                <span className="text-xs bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full border border-saffron-200 font-medium">🕰️ {minExperience}+ yrs experience</span>
              )}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-bold ml-2 underline">Clear all</button>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Loading Pandits...</p>
              </div>
            ) : filteredPandits.length > 0 ? (
              filteredPandits.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col sm:flex-row gap-6"
                >
                  <img
                    src={p.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name}&backgroundColor=fce8db&textColor=854d0e`}
                    alt={p.user?.name}
                    className="w-28 h-28 rounded-2xl border-2 border-saffron-100 mx-auto sm:mx-0 object-cover bg-saffron-50 shadow-sm"
                  />
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{p.user?.name}</h2>
                        <div className="flex items-center text-amber-500 text-sm font-medium mt-1 gap-1">
                          <Star className="w-4 h-4 fill-amber-400" /> {p.rating || 'New'}
                          <span className="text-gray-400 ml-1">({p.reviewsCount || 0} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-extrabold text-gray-900">₹{p.charges || 1100}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">starts at</div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mt-3 gap-4 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {p.city}</span>
                      <span className="flex items-center gap-1">🕰️ {p.experience} years exp.</span>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {p.specialization?.map(t => (
                        <span
                          key={t}
                          className={`text-xs px-3 py-1 rounded-full border font-medium ${
                            selectedPoojaTypes.includes(t)
                              ? 'bg-saffron-500 text-white border-saffron-500'
                              : 'bg-saffron-50 text-saffron-700 border-saffron-100'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Link to={`/pandit/${p._id}`} className="flex-1 flex items-center justify-center py-2.5 border border-saffron-300 text-saffron-600 rounded-xl hover:bg-saffron-50 font-bold text-sm transition-colors">View Profile</Link>
                      <Link to={`/book/${p._id}`} className="flex-1 flex items-center justify-center py-2.5 bg-gradient-to-r from-[#800000] to-[#c05c29] text-white rounded-xl hover:opacity-90 font-bold text-sm shadow-sm transition-opacity">Book Now</Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Pandits Found</h3>
                <p className="text-gray-500 text-sm mb-5">Try adjusting your filters or search criteria.</p>
                <button onClick={clearFilters} className="bg-saffron-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-saffron-600 transition-colors shadow-md">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}
