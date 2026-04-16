import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, MessageSquare, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

const emojiRatings = [
  { emoji: '😞', label: 'Very Bad', value: 1, color: 'bg-red-100 border-red-200 text-red-600' },
  { emoji: '😕', label: 'Bad', value: 2, color: 'bg-orange-100 border-orange-200 text-orange-600' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-yellow-100 border-yellow-200 text-yellow-600' },
  { emoji: '😊', label: 'Good', value: 4, color: 'bg-green-100 border-green-200 text-green-600' },
  { emoji: '🤩', label: 'Amazing!', value: 5, color: 'bg-emerald-100 border-emerald-200 text-emerald-600' },
];

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [useful, setUseful] = useState(null); // true/false/null
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return alert('Please select a rating.');
    // In production, send to backend API
    console.log('Feedback:', { rating, useful, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-cream-50 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Thank You! 🙏</h2>
          <p className="text-gray-500 mb-8">Your feedback helps us improve Pooja Connect and serve you better.</p>
          <Link to="/" className="inline-block bg-gradient-to-r from-[#800000] to-[#c05c29] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#800000] via-[#c05c29] to-[#e86424] p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-12 -mt-12" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-10 -mb-10" />
            <div className="relative z-10">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <h1 className="text-3xl font-extrabold">Share Your Feedback</h1>
              <p className="text-white/70 mt-2 text-sm">We'd love to hear what you think about Pooja Connect</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* 1. Is the website useful? */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Is this website useful for you?</h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setUseful(true)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                    useful === true ? 'bg-green-50 border-green-400 text-green-700 shadow-md shadow-green-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-green-300'
                  }`}
                >
                  <ThumbsUp className={`w-6 h-6 ${useful === true ? 'fill-green-500' : ''}`} /> Yes!
                </button>
                <button
                  type="button"
                  onClick={() => setUseful(false)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 font-bold text-lg transition-all ${
                    useful === false ? 'bg-red-50 border-red-400 text-red-600 shadow-md shadow-red-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-red-300'
                  }`}
                >
                  <ThumbsDown className={`w-6 h-6 ${useful === false ? 'fill-red-400' : ''}`} /> Not Really
                </button>
              </div>
            </div>

            {/* 2. Emoji Rating */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">How would you rate your overall experience?</h3>
              <div className="flex gap-3 justify-center">
                {emojiRatings.map(er => (
                  <button
                    key={er.value}
                    type="button"
                    onClick={() => setRating(er.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all min-w-[70px] ${
                      rating === er.value
                        ? `${er.color} scale-110 shadow-lg`
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{er.emoji}</span>
                    <span className={`text-[10px] font-bold ${rating === er.value ? '' : 'text-gray-400'}`}>{er.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Comment */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Any suggestions or comments?</h3>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Tell us what you liked, what can be improved, or any feature you'd like to see..."
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 resize-none transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#800000] to-[#c05c29] text-white font-bold py-4 rounded-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
            >
              <Send className="w-5 h-5" /> Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
