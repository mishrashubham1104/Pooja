import { useState, useEffect } from 'react';
import { Search, Star, MapPin, CheckCircle, X, AlertCircle, CalendarDays, Quote, Sun, Moon, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';

import pujaBg from '../assets/puja_bg.png';

const services = [
  { name: 'Satyanarayan Pooja', icon: '🕊️', desc: 'Seek blessings of Lord Vishnu for peace and prosperity with a complete Vedic ritual.', image: 'https://pujanpujari.com/cdn/shop/files/puja_bg_for_website.jpg?crop=center&height=553&v=1757678801&width=461' },
  { name: 'Griha Pravesh', icon: '🏠', desc: 'Auspicious entry into your new home with divine blessings and Vastu Shanti.', image: 'https://ompoojapath.com/frontend/assets/images/bbbanner.jpg' },
  { name: 'Wedding Pooja', icon: '💍', desc: 'Traditional Vedic mantras and complete rituals for a blissful married life.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTzaxCEX_UmNxH354NTykaLmmyQ1uZsHlhdA&s' },
  { name: 'Navgraha Shanti', icon: '🌌', desc: 'Pacify the nine planets and invite positive energy into your life.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc0UGpfKfCRG3j5fsdgGbOMYUOdQejE5a9QA&s' },
  { name: 'Kaal Sarp Dosh Puja', icon: '🐍', desc: 'Overcome the ill effects of Kaal Sarp Dosh for a peaceful and prosperous life.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwY_URVp0ugS4jrSDt4zzgcSQS1yPB8Mzucg&s' },
  { name: 'Narayan Bali Puja', icon: '🕊️', desc: 'Fulfill the unsatisfied desires of ancestors and cure your Pitra Dosh.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT91UPdnlgnP-_2j_rsUvW-JnAmeQauQNoSFA&s' },
  { name: 'Rudrabhishek Puja', icon: '🍃', desc: 'Invoke Lord Shiva with 11 holy ingredients to destroy negative karma.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHD1lj3gkIy2eaXuzriuj7Z9BGXEO1CgW6Qg&s' },
  { name: 'Maha Mrityunjay Jaap', icon: '🕉️', desc: 'A powerful chanting ritual for long life, health, and liberation from fear.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWVavVyATTwX5XYz4HWu-Vq0qfHKIvmOrPMg&s' }
];

const DESTINATIONS = [
  { city: 'Varanasi', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5LxFGtD_iUae8gb_s07atrT29sLIOnjPvHg&s', color: '#7c2d12' },
  { city: 'Haridwar', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5GugqotOUA7ORhPMjC6xnaY0ozNkCSx3_RQ&s', color: '#065f46' },
  { city: 'Ujjain', img: 'https://mangaldosh.in/wp-content/uploads/2025/09/654d3aa40b7d46fc5b40aabaee773220.jpg', color: '#1e3a5f' },
  { city: 'Nashik', img: 'https://blog.7applehotels.com/wp-content/uploads/2023/09/trimbakeshwar-temple.jpg', color: '#4a1d96' },
  { city: 'Pushkar', img: 'https://www.timesindiatravels.com/wp-content/uploads/2017/09/Indias-Top-Destinations-Pushkar.jpg', color: '#78350f' },
  { city: 'Ayodhya', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSyA9CrK8xTJ3jl_gsIylSf2GTZSbf_HYQQ&s', color: '#7c2d12' },
  { city: 'Mathura', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSyA9CrK8xTJ3jl_gsIylSf2GTZSbf_HYQQ&s', color: '#1a3a5c' },
  { city: 'Vrindavan', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWJ82Md5EjZSB2x_5GHj5MzL1n5WHJTxgj1w&s', color: '#134e4a' },
  { city: 'Dwarka', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRacSweTUisIMSfwtFniIMH9-zBlH9PEEvswQ&s', color: '#1e3a8a' },
  { city: 'Puri', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgYwwwq3-IAHw0nHNKnmhbALt_td-ZgC7xaw&s', color: '#7c2d12' },
  { city: 'Tirupati', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREM5OVHnZmKd_dhKFbqBD1VHiYKdkJ-e5EYCjANSxF-A&s', color: '#4a1d96' },
  { city: 'Rameshwaram', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ch-na4Hw2hqAfeVJjzIE0RaO0Yl2T5aFSw&s', color: '#064e3b' }
];

const MUHURATS = [
  { day: '12', month: 'MAY', title: 'Akshaya Tritiya', desc: 'Highly auspicious for new beginnings and homam.', img: 'https://camouflageclicks.com/assets/uploads/blog/4875821.jpg' },
  { day: '18', month: 'JUN', title: 'Ganga Dussehra', desc: 'Perform River Puja to wash away sins and invoke purity.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZe3dX8kvdyV3ykiLrvnrwetx6SC7Aatngfw&s' },
  { day: '25', month: 'JUL', title: 'Nag Panchami', desc: 'Perform Kaal Sarp Dosh Puja and seek protection.', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiqNxvgSwbO-D5ok11hQUQcihXLxUj0SqM7A&s' },
  { day: '15', month: 'AUG', title: 'Raksha Bandhan', desc: 'Special Poojas for family protection and harmony.', img: 'https://www.partyvillas.in/blog/wp-content/uploads/2025/07/raksha-bandhan-message-image.jpg' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', location: 'Delhi', text: 'Booking a Pandit for our Griha Pravesh was so seamless. Pandit Ji was extremely knowledgeable and explained the significance of every Vedic ritual beautifully. Would highly recommend!', rating: 5, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Rahul&backgroundColor=fce8db' },
  { name: 'Priya Patel', location: 'Mumbai', text: 'We booked a virtual Satyanarayan Katha since we live abroad. The video quality was great, the chanting was mesmerising, and the overall experience felt incredibly authentic and divine.', rating: 5, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=fce8db' },
  { name: 'Anil Desai', location: 'Pune', text: 'Very professional platform. The transparent pricing and verified Pandits gave us peace of mind during our wedding preparations. Everything started completely on time.', rating: 5, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Anil&backgroundColor=fce8db' },
  { name: 'Sneha Verma', location: 'Bangalore', text: 'The ease of finding a Pandit for a specific date and time is unmatched. A deeply spiritual experience at our new office inauguration.', rating: 5, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sneha&backgroundColor=fce8db' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [featuredPandits, setFeaturedPandits] = useState([]);
  const [unavailableModal, setUnavailableModal] = useState(null);
  const navigate = useNavigate();

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
        if (Array.isArray(data)) {
          const sortedData = [...data].reverse();
          setFeaturedPandits(sortedData.slice(0, 3));
        }
      })
      .catch(err => console.error('Error fetching pandits:', err));
  }, [navigate]);

  const handleBookNow = (e, serviceName) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/pooja/${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="bg-cream-50">

      {/* No Pandit Available Modal */}
      <AnimatePresence>
        {unavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
            onClick={() => setUnavailableModal(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setUnavailableModal(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-10 h-10 text-[#DA6626]" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">No Pandits Available</h3>

              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                Sorry, no pandits are currently registered for{' '}
                <span className="font-semibold text-[#DA6626]">{unavailableModal}</span> on our platform.
              </p>
              <p className="text-gray-400 text-xs mb-7">
                Please check back later or explore other available services.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setUnavailableModal(null)}
                  className="w-full py-3 bg-[#DA6626] hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Explore Other Services
                </button>
                <Link
                  to="/register"
                  onClick={() => setUnavailableModal(null)}
                  className="w-full py-3 border border-[#DA6626] text-[#DA6626] font-semibold rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Register as a Pandit
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${pujaBg})` }}
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#710000] tracking-tight leading-tight mb-6">
              Book Trusted Pandits for <br className="hidden md:block" /> Every Pooja &amp; Paath
            </h1>
            <p className="text-lg md:text-xl text-[#C05C29] font-semibold max-w-2xl mx-auto mb-10">
              Find experienced Pandits for Satyanarayan Pooja, Griha Pravesh, Wedding Pooja, Mundan, Havan, Rudrabhishek and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pandits" className="px-8 py-4 text-lg font-bold bg-[#DA6626] text-white rounded-full hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all">Book a Pandit</Link>
              <Link to="/register" className="px-8 py-4 text-lg font-bold bg-white text-[#DA6626] border-2 border-[#DA6626] rounded-full hover:bg-orange-50 shadow-md transition-all">Become a Pandit</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto -mt-8 relative z-10 px-4">
        <form
          onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/pandits?q=${encodeURIComponent(search.trim())}`); }}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-4 py-2 hover:border-saffron-300 focus-within:border-saffron-500 transition-colors">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Search Pooja, City, or Pandit..."
              className="w-full focus:outline-none text-gray-700 bg-transparent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-maroon-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-maroon-700 transition-colors shadow-md">Search</button>
        </form>
      </section>

      {/* Today's Panchang Widget */}
      <section className="max-w-4xl mx-auto mt-6 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-5 md:p-6 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-100">
            <h3 className="text-lg font-bold text-maroon-700 flex items-center gap-2">
              <Sun className="text-orange-500 w-6 h-6" /> Today's Panchang
            </h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">New Delhi, India</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tithi</p>
              <p className="text-gray-900 font-semibold flex items-center justify-center md:justify-start gap-1"><Moon className="w-4 h-4 text-indigo-500"/> Krishna Ekadashi</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Nakshatra</p>
              <p className="text-gray-900 font-semibold flex items-center justify-center md:justify-start gap-1"><Star className="w-4 h-4 text-yellow-500"/> Rohini</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Sunrise / Sunset</p>
              <p className="text-gray-900 font-semibold text-sm">05:42 AM / 06:45 PM</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 md:p-0 md:bg-transparent">
              <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-1">Rahu Kaal</p>
              <p className="text-red-700 font-bold text-sm flex items-center justify-center md:justify-start gap-1"><Clock className="w-4 h-4"/> 10:30 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-maroon-600 mb-4">Popular Pooja Services</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </div>

        {/* ─── MOBILE: Infinite Auto-Scroll Marquee ─── */}
        <div className="block md:hidden py-4">
          <div className="marquee-wrapper px-2">
            <div className="marquee-track flex" style={{ gap: '24px' }}>
              {/* Render array twice for a seamless infinite loop */}
              {[...services, ...services].map((srv, i) => (
                <div
                  key={i}
                  tabIndex={0}
                  style={{ width: '280px', marginRight: '24px' }}
                  className="relative flex-shrink-0 bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden group cursor-pointer hover:shadow-2xl focus:outline-none transition-all duration-300"
                >
                  {/* Pooja Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <div className="hidden absolute inset-0 bg-saffron-50 items-center justify-center text-6xl">{srv.icon}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 text-2xl drop-shadow">{srv.icon}</span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 h-32">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{srv.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">{srv.desc}</p>
                  </div>

                  {/* Hover/Focus Book Button (Pops up on Tap/Hover) */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-focus:pointer-events-auto">
                    <button
                      onClick={(e) => handleBookNow(e, srv.name)}
                      className="pointer-events-auto bg-[#DA6626] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300"
                    >
                      📅 Book Now
                    </button>
                  </div>

                  {/* Subtle hover tint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── DESKTOP: Grid ─── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, i) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={i}
              className="relative bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              {/* Pooja Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="hidden absolute inset-0 bg-saffron-50 items-center justify-center text-6xl">{srv.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute top-3 left-3 text-2xl drop-shadow">{srv.icon}</span>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{srv.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{srv.desc}</p>
              </div>

              {/* Hover Book Button */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={(e) => handleBookNow(e, srv.name)}
                  className="pointer-events-auto bg-[#DA6626] hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                >
                  📅 Book Now
                </button>
              </div>

              {/* Subtle hover tint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/services" className="text-saffron-600 font-medium hover:text-saffron-800 flex items-center justify-center gap-2">
            View all Poojas <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Divine Locations */}
      <section className="py-10 px-4 max-w-7xl mx-auto rounded-3xl mb-8 border border-saffron-100" style={{ backgroundImage: "linear-gradient(to right, rgba(255,247,237,0.7), rgba(255,237,213,0.7))" }}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-maroon-600 mb-4">Divine Destinations</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Find experienced Pandits in the most sacred cities of India.</p>
        </div>

        {/* ─── MOBILE: 3D Card Stacking Swiper ─── */}
        <div className="block md:hidden pb-2 pt-4">
          <div className="flex justify-center">
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards, Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              initialSlide={0}
              style={{ width: '240px', height: '320px' }}
            >
              {DESTINATIONS.map((dest, i) => (
                <SwiperSlide
                  key={i}
                  style={{ borderRadius: '20px', overflow: 'hidden', background: dest.color }}
                >
                  <Link to={`/pandits?city=${dest.city}`} className="w-full h-full block relative group">
                    <img
                      src={dest.img}
                      alt={dest.city}
                      className="w-full h-full object-cover brightness-75 transition-all duration-700"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <div className="text-white font-black text-xl drop-shadow-xl">{dest.city}</div>
                      <div className="text-saffron-400 text-xs font-bold uppercase tracking-wider mt-1">View Pandits →</div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
                      🕉️ {i + 1}/{DESTINATIONS.length}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <p className="text-center text-gray-500 text-xs mt-6 mb-2">← Swipe to explore more →</p>
        </div>

        {/* ─── DESKTOP: Infinite Auto-Scroll Marquee ─── */}
        <div className="hidden md:block">
          <div className="marquee-wrapper">
            <div className="marquee-track gap-4" style={{ gap: '16px' }}>
              {/* Render twice for seamless infinite loop */}
              {[...DESTINATIONS, ...DESTINATIONS].map((dest, i) => (
                <Link
                  to={`/pandits?city=${dest.city}`}
                  key={i}
                  className="group relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-gray-800 transition-all duration-300 hover:scale-105 hover:z-10 hover:ring-2 hover:ring-saffron-500 hover:shadow-[0_20px_40px_-5px_rgba(234,88,12,0.5)]"
                  style={{ width: '180px', height: '240px', background: dest.color, marginRight: '16px' }}
                >
                  <img
                    src={dest.img}
                    alt={dest.city}
                    className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-4 pt-16">
                    <div className="text-white font-black text-base drop-shadow-xl">{dest.city}</div>
                    <div className="text-saffron-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 mt-1">View Pandits →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pandits */}
      <section className="py-20 bg-saffron-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-maroon-600 mb-4">Featured Pandits</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPandits.length > 0 ? featuredPandits.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-saffron-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold-500 text-white px-3 py-1 rounded-bl-lg font-bold text-sm flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-white" /> {p.rating || 'New'}
                </div>
                <div className="flex gap-4 mb-4">
                  <img
                    src={p.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name}&backgroundColor=fce8db&textColor=854d0e`}
                    alt={p.user?.name}
                    className="w-20 h-20 rounded-full border-2 border-saffron-200 bg-saffron-50 object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{p.user?.name}</h3>
                    <p className="text-saffron-600 text-sm font-medium">{p.experience} years exp</p>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> {p.city}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-6">
                  <span className="font-semibold text-gray-700">Specialization:</span> {p.specialization?.join(', ')}
                </div>
                <div className="flex gap-2">
                  <Link to={`/pandit/${p._id}`} className="flex-1 text-center py-2 border border-saffron-300 text-saffron-600 rounded-lg hover:bg-saffron-50 font-medium transition-colors">View Profile</Link>
                  <Link to={`/book/${p._id}`} className="flex-1 text-center py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 font-medium shadow-sm transition-colors">Book Now</Link>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500 py-10 font-medium">No Pandits available yet. Be the first to register!</div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works & Why Choose Us */}
      <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold text-maroon-600 mb-8">How It Works</h2>
          <div className="space-y-6">
            {[
              { title: 'Search Pooja or Pandit', desc: 'Easily browse our verified list of services and pandits.' },
              { title: 'Choose the right Pandit', desc: 'View profiles, reviews, and experience to make the best choice.' },
              { title: 'Select Date & Time', desc: 'Find a convenient slot that fits your Muhurat.' },
              { title: 'Confirm Booking', desc: 'Securely confirm and prepare for your divine ceremony.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">{i + 1}</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{step.title}</h4>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-maroon-600 mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              'Verified Pandits', 'Easy Booking', 'Transparent Pricing', 'Experienced Priests', 'Multi-language Support', '24/7 Support'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-saffron-100">
                <CheckCircle className="text-gold-500 w-6 h-6 flex-shrink-0" />
                <span className="font-semibold text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Shubh Muhurat Calendar */}
      <section className="py-24 relative overflow-hidden bg-maroon-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-bold tracking-widest uppercase text-sm mb-2 block">Vedic Calendar</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Upcoming Shubh Muhurats
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full"></div>
            <p className="text-gold-100 mt-6 max-w-2xl mx-auto text-lg">Plan your sacred ceremonies on the most auspicious celestial dates.</p>
          </div>

          <div className="mt-12 pb-10 w-full overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.2 },
                1280: { slidesPerView: 4.2 },
              }}
              autoplay={{ delay: 1000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              speed={1000}
              loop={true}
              grabCursor={true}
              className="px-4 py-8 max-w-[1400px] mx-auto"
            >
              {[...MUHURATS, ...MUHURATS].map((muhurat, idx) => (
                <SwiperSlide 
                  key={idx} 
                  className="rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col group bg-maroon-800 h-[500px]"
                >
                  <div className="absolute inset-0">
                    <img src={muhurat.img} alt={muhurat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                  </div>
                  
                  <div className="relative p-8 h-full flex flex-col justify-between">
                    {/* Date Badge */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center w-24 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                      <div className="text-4xl font-black text-white leading-none mb-1">{muhurat.day}</div>
                      <div className="text-xs font-bold text-gold-400 tracking-wider">{muhurat.month}</div>
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{muhurat.title}</h3>
                      <p className="text-gray-200 text-sm md:text-base mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">{muhurat.desc}</p>
                      
                      <Link to={`/pandits`} className="inline-flex items-center justify-between w-full p-4 bg-white/10 hover:bg-gold-500 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-sm border border-white/30">
                        <span>Book a Pandit</span>
                        <span className="bg-white/20 p-2 rounded-xl group-hover:bg-amber-100/20">→</span>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Premium Testimonials with Swiper */}
      <section className="pt-20 pb-6 px-4 bg-cream-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-saffron-600 font-bold tracking-widest uppercase text-sm mb-2 block">Divine Connections</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-maroon-600 mb-6 font-serif">Devotee Experiences</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-6 text-lg">Thousands of blessed families. Here is what they are saying.</p>
          </div>

          <div className="max-w-6xl mx-auto pb-2">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              grabCursor={true}
              loop={true}
              className="px-4 pt-4 pb-2"
            >
              {TESTIMONIALS.map((testimonial, i) => (
                <SwiperSlide key={i} className="py-4">
                  <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-saffron-50 h-full flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full border-2 border-saffron-100 bg-orange-50 object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-saffron-600 font-medium">{testimonial.location}</p>
                      </div>
                      <Quote className="w-10 h-10 text-saffron-100 ml-auto" />
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < testimonial.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                      ))}
                    </div>

                    <p className="text-gray-600 italic leading-relaxed flex-grow text-lg">"{testimonial.text}"</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}
