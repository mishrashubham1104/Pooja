import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-maroon-600 text-saffron-50 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2">
              <span role="img" aria-label="Om">🕉️</span> Pooja Connect
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Find experienced Pandits for all your religious needs. Trust, devotion, and convenience.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-saffron-400 transition-colors">Home</Link></li>
              <li><Link to="/pandits" className="text-gray-400 hover:text-saffron-400 transition-colors">Browse Pandits</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-saffron-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-saffron-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="text-gray-400 hover:text-saffron-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-saffron-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Feedback */}
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Help Us Improve</h4>
            <p className="text-gray-400 text-sm mb-4">Your feedback helps us serve you better.</p>
            <Link to="/feedback" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#DA6626] to-[#c05c29] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-md">
              <MessageSquare className="w-4 h-4" /> Give Feedback
            </Link>
          </div>

        </div>

        <div className="border-t border-gray-700/50 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Pooja Connect. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/feedback" className="hover:text-gray-300 transition-colors">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
