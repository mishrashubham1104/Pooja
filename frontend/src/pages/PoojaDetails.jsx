import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, ListChecks, MapPin, Star } from 'lucide-react';

const POOJA_INFO = {
  "Kaal Sarp Dosh Puja": {
    title: "Kaal Sarp Dosh Puja",
    description: "Kaal Sarp Dosh occurs when all seven planets come between Rahu and Ketu in an astrological chart. This puja is performed to overcome completely the ill effects of Kaal Sarp Dosh.",
    benefits: [
      "Removes obstacles from financial growth and career.",
      "Ensures harmony in family and married life.",
      "Brings peace of mind and improves mental health."
    ],
    samagri: [
      "Rahu & Ketu Yantra", "Black Sesame Seeds", "Mustard Oil", "Black Cloth", "Urad Dal", "Coconut", "Flowers & Fruits", "Incense Sticks"
    ],
    image: "https://pujanpujari.com/cdn/shop/files/puja_bg_for_website.jpg?crop=center&height=553&v=1757678801&width=461"
  },
  "Narayan Bali Puja": {
    title: "Narayan Bali Puja",
    description: "Narayan Bali is performed to fulfill the unsatisfied desires of ancestors whose souls are wandering in the physical realm. It is specifically done at holy places like Trimbakeshwar or Gaya.",
    benefits: [
      "Liberates ancestors from the cycle of birth and death.",
      "Cures Pitra Dosh in the Kundli.",
      "Resolves persistent family problems and sudden accidents."
    ],
    samagri: [
      "Ghee", "Milk", "Honey", "Tulsi Leaves", "Yellow Cloth", "Rice Pindas", "Darbha Grass", "Copper Vessel"
    ],
    image: "https://images.unsplash.com/photo-1593014169541-11e25e364604?auto=format&fit=crop&q=80&w=600"
  },
  "Rudrabhishek Puja": {
    title: "Rudrabhishek Puja",
    description: "Rudrabhishek is the most powerful and auspicious ritual in Hinduism performed to invoke the blessings of Lord Shiva by bathing the Shivalinga with 11 holy ingredients.",
    benefits: [
      "Destroys negative karma and washes away sins.",
      "Brings victory over enemies and competitors.",
      "Grants supreme protection, wealth, and health."
    ],
    samagri: [
      "Cow's Milk", "Curd", "Ghee", "Honey", "Sugar", "Ganga Jal", "Bael Leaves (Bilva Patra)", "Bhasma (Ashes)", "Dhatura", "Sandalwood Paste"
    ],
    image: "https://images.unsplash.com/photo-1561359313-0639aad3a644?auto=format&fit=crop&q=80&w=600"
  },
  "Griha Pravesh": {
    title: "Griha Pravesh",
    description: "Griha Pravesh is a Hindu ceremony performed on the occasion of an individual's first entry into their new home. It involves Vastu Shanti and Navgraha Shanti.",
    benefits: [
      "Purifies the premises and drives away negative energies.",
      "Brings good fortune, health, and prosperity to the family.",
      "Appeases Vastu Purush."
    ],
    samagri: [
      "Haldi (Turmeric)", "Kumkum", "Mango Leaves", "Rice", "Coconut", "Kalas", "Cow Urine (Gomutra)", "Navadhanya (Nine grains)"
    ],
    image: "https://ompoojapath.com/frontend/assets/images/bbbanner.jpg"
  },
  "Satyanarayan Pooja": {
    title: "Satyanarayan Pooja",
    description: "The Satyanarayan Puja is a religious worship of the Hindu god Vishnu to bless one's home with abundance and prosperity.",
    benefits: [
      "Ensures abundance, wealth, and peace.",
      "Fulfils spiritual and material desires.",
      "Helps in spiritual upliftment."
    ],
    samagri: [
      "Idol/Picture of Lord Vishnu", "Panchamrit", "Tulsi Leaves", "Banana Leaves", "Fruits", "Sweets (Prasad)", "Incense", "Diya"
    ],
    image: "https://pujanpujari.com/cdn/shop/files/puja_bg_for_website.jpg?crop=center&height=553&v=1757678801&width=461"
  },
  "Wedding Puja": {
    title: "Wedding Puja",
    description: "Vedic rites and mantras bless the matrimonial bond between a bride and groom, invoking the gods to oversee their union.",
    benefits: [
      "Establishes a strong spiritual foundation for marriage.",
      "Removes obstacles in married life.",
      "Brings divine blessings from Navgrahas."
    ],
    samagri: [
      "Havan Kund", "Ghee", "Wood", "Sindoor", "Mangalsutra", "Flower Garlands", "Betel Leaves & Nuts", "Rice"
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTzaxCEX_UmNxH354NTykaLmmyQ1uZsHlhdA&s"
  }
};

// Generic fallback data
const DEFAULT_POOJA_INFO = {
  description: "A highly auspicious Vedic ritual performed by specialized Pandits to bring peace, prosperity, and divine blessings. This pooja is conducted with strict adherence to ancient scriptures.",
  benefits: [
    "Attracts positive cosmic energy.",
    "Provides spiritual peace and purification.",
    "Fulfills sankalpa (righteous desires) of the devotee."
  ],
  samagri: [
    "Flowers", "Fruits", "Incense Sticks", "Ghee Diya", "Kumkum & Haldi", "Rice (Akshat)", "Coconut", "Betel Leaves"
  ],
  image: "https://images.unsplash.com/photo-1606553894726-dcaeb6675e84?auto=format&fit=crop&q=80&w=800"
};

export default function PoojaDetails() {
  const { id } = useParams(); // URL encoded pooja name
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode the pooja name
  const poojaName = decodeURIComponent(id || '');

  // Get info from dictionary or fallback
  const info = POOJA_INFO[poojaName] || { ...DEFAULT_POOJA_INFO, title: poojaName };

  useEffect(() => {
    // Fetch all pandits and filter on client side
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter pandits who match this specific pooja type
          const matched = data.filter(p => 
            Array.isArray(p.specialization) &&
            p.specialization.some(s => s.toLowerCase().includes(poojaName.toLowerCase()) || poojaName.toLowerCase().includes(s.toLowerCase()))
          );
          setPandits(matched);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pandits:", err);
        setLoading(false);
      });
  }, [poojaName]);

  return (
    <div className="bg-cream-50 min-h-screen pb-20">
      {/* Hero Banner */}
      <div 
        className="relative h-64 md:h-96 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${info.image})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg font-serif">
              {info.title}
            </h1>
            <p className="text-saffron-300 font-medium text-lg md:text-xl max-w-2xl mx-auto drop-shadow">
              Discover the divine significance, essential samagri, and find verified authentic Pandits.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-10">
        
        {/* Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Significance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-saffron-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-maroon-100 p-3 rounded-xl">
                <Info className="w-6 h-6 text-maroon-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Significance & Benefits</h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-6 font-medium">
              {info.description}
            </p>
            
            <h3 className="font-bold text-gray-800 mb-3 text-lg">Key Benefits:</h3>
            <ul className="space-y-3">
              {info.benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-gray-600">
                  <Star className="w-5 h-5 text-saffron-500 fill-saffron-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Samagri */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-saffron-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-saffron-100 p-3 rounded-xl">
                <ListChecks className="w-6 h-6 text-saffron-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Required Samagri List</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6 bg-saffron-50 p-3 rounded-lg border border-saffron-100">
              Note: Most of our Pandits can arrange these items for you at a minimal additional cost. Please discuss directly after booking.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {info.samagri.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-3 rounded-xl font-medium text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-saffron-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Pandits Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-maroon-600">Available Pandits for {info.title}</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full mt-4"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Finding pure souls...</p>
          </div>
        ) : pandits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pandits.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col sm:flex-row gap-6"
              >
                <img
                  src={p.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name}&backgroundColor=fce8db&textColor=854d0e`}
                  alt={p.user?.name}
                  className="w-32 h-32 rounded-2xl border-2 border-saffron-100 mx-auto sm:mx-0 object-cover bg-saffron-50 shadow-sm"
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
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mt-3 gap-4 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {p.city}</span>
                    <span className="flex items-center gap-1">🕰️ {p.experience} years exp.</span>
                  </div>

                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {p.bio || `Verified Vedic Pandit from ${p.city}. Specially trained in authentic ritual processes and mantras.`}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <Link to={`/pandit/${p._id}`} className="flex-1 flex items-center justify-center py-3 border-2 border-saffron-300 text-saffron-600 rounded-xl hover:bg-saffron-50 font-bold text-sm transition-colors">View Profile</Link>
                    <Link to={`/book/${p._id}?type=${encodeURIComponent(poojaName)}`} className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-[#800000] to-[#c05c29] text-white rounded-xl hover:opacity-90 font-bold text-sm shadow-md transition-opacity">Book from ₹{p.charges || 1100}</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4">
            <div className="text-5xl mb-4">🕉️</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Pandits Available Right Now</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
              We currently don't have verified pandits offering {info.title}. Please check back later or explore other religious services.
            </p>
            <Link to="/services" className="bg-saffron-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-saffron-600 transition-colors shadow-md inline-block">
              Explore All Poojas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
