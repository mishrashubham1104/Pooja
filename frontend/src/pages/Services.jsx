import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const POOJA_CATEGORIES = [
  {
    category: "Dosh Nivaran Pujas",
    icon: "🌌",
    items: [
      "Kaal Sarp Dosh Puja",
      "Narayan Bali Puja",
      "Mangal Dosh Nivaran Puja",
      "Pitra Dosh Nivaran Puja",
      "Navgrah Dosh Nivaran Puja",
      "Guru Chandal Dosh Nivaran"
    ]
  },
  {
    category: "Auspicous Occasions",
    icon: "🏠",
    items: [
      "Griha Pravesh",
      "Wedding Puja",
      "Namkaran Puja",
      "Satyanarayan Katha",
      "Vastu Shanti Puja",
      "Birthday Puja",
      "Anniversary Puja",
      "New Car Puja"
    ]
  },
  {
    category: "Deity Specific",
    icon: "🕉️",
    items: [
      "Shiv Puja",
      "Maha Mrityunjay Jaap",
      "Rudrabhishek Puja",
      "Ganesh Gauri Puja",
      "Vishnu Puja",
      "Hanuman Puja",
      "Durga Mata Puja",
      "Mahalaxmi Havan",
      "Saraswati Puja"
    ]
  },
  {
    category: "Ancestral Offerings",
    icon: "🕊️",
    items: [
      "Shradh Puja",
      "Pind Daan Puja",
      "Tarpan Puja",
      "Asthi Visarjan Puja",
      "Tripindi Shradha Puja"
    ]
  },
  {
    category: "Festive & Rituals",
    icon: "🪔",
    items: [
      "Diwali Puja",
      "Dhanteras Puja",
      "Chaitra Navratri Puja",
      "Makar Sankranti Puja",
      "Ganga Puja",
      "Chandi Yagya"
    ]
  }
];

export default function Services() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/pandits?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handlePoojaClick = (pooja) => {
    navigate(`/pooja/${encodeURIComponent(pooja)}`);
  };

  return (
    <div className="bg-cream-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Search Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-maroon-600 mb-6 drop-shadow-sm">
          A-Z Puja Directory
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Find and book experienced Pandits for any specific ritual, havan, or dosh nivaran puja across India.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center bg-white rounded-full shadow-lg border border-saffron-200 overflow-hidden focus-within:ring-2 ring-saffron-400 focus-within:border-saffron-400 transition-all">
          <div className="pl-6 text-gray-400"><Search className="w-6 h-6" /></div>
          <input
            type="text"
            placeholder="Search for any specific Puja..."
            className="w-full py-4 px-4 outline-none text-gray-700 bg-transparent text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-[#DA6626] hover:bg-orange-600 text-white px-8 py-4 font-bold transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Categorized Grid */}
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {POOJA_CATEGORIES.map((cat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-saffron-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl bg-saffron-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-saffron-200 shadow-sm">
                {cat.icon}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-saffron-200 pb-2 flex-grow">
                {cat.category}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cat.items.map((pooja, i) => (
                <button
                  key={i}
                  onClick={() => handlePoojaClick(pooja)}
                  className="flex items-center justify-between p-4 rounded-xl text-left border border-gray-100 hover:border-saffron-400 hover:shadow-md bg-cream-50 hover:bg-saffron-50 transition-all group"
                >
                  <span className="font-semibold text-gray-700 group-hover:text-maroon-600 transition-colors">
                    {pooja}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-maroon-600 transform group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
