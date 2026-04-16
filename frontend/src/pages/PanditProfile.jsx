import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Languages, BadgeInfo, Heart, Send, User2, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-transform ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.customerName
    ? review.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-saffron-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-gray-800">{review.customerName || 'Anonymous'}</span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
          <StarRating value={review.rating} readOnly size="sm" />
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PanditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [submittingFavorite, setSubmittingFavorite] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!token);

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (userObj.role === 'pandit') {
        navigate('/dashboard/pandit');
        return;
      }
    }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/${id}`)
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/${id}/reviews`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(console.error);

    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(user => {
          if (user.favoritePandits?.some(p => p._id === id || p === id)) setIsFavorite(true);
        }).catch(console.error);
    }
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to add favorites.');
    setSubmittingFavorite(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me/favorites`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ panditId: id }),
      });
      if (res.ok) setIsFavorite(!isFavorite);
    } catch (err) { console.error(err); }
    finally { setSubmittingFavorite(false); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    if (!reviewRating) return setReviewError('Please select a star rating.');
    if (!reviewComment.trim()) return setReviewError('Please write a comment.');

    const token = localStorage.getItem('token');
    setReviewLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/${id}/reviews`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      const data = await res.json();
      if (!res.ok) return setReviewError(data.message || 'Failed to submit review.');
      setReviewSuccess('Your review has been submitted! 🙏');
      setReviewRating(0);
      setReviewComment('');
      // Refresh reviews & update rating
      const rev = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pandits/${id}/reviews`).then(r => r.json());
      if (Array.isArray(rev)) setReviews(rev);
      setProfile(prev => prev ? { ...prev, rating: data.rating, reviewsCount: data.reviewsCount } : prev);
    } catch {
      setReviewError('Something went wrong. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Render stars for display
  const renderStars = (rating) => {
    return [1,2,3,4,5].map(s => (
      <Star key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-cream-50">
      <div className="w-12 h-12 border-4 border-saffron-200 border-t-saffron-500 rounded-full animate-spin" />
      <p className="text-saffron-600 font-medium">Loading Profile...</p>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center text-maroon-600 font-bold text-xl bg-cream-50">Pandit profile not found.</div>
  );

  return (
    <div className="bg-cream-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-[#800000] via-[#c05c29] to-[#e86424] relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent" />
          </div>

          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 mb-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={profile.user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.user?.name}&backgroundColor=fce8db&textColor=854d0e`}
                  alt={profile.user?.name}
                  className="w-36 h-36 rounded-2xl border-4 border-white shadow-xl object-cover bg-saffron-50"
                />
                {profile.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white shadow">
                    <CheckCircle className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-4 md:pt-0">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2 flex-wrap">
                  {profile.user?.name}
                  {profile.isVerified && <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                </h1>
                <p className="text-saffron-600 font-medium mt-0.5">Vedic Priest &amp; Astrologer · {profile.experience} Years Experience</p>

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {renderStars(profile.rating)}
                    <span className="ml-1 font-bold text-gray-800">{profile.rating > 0 ? profile.rating : '—'}</span>
                    <span className="text-gray-400 text-sm">({profile.reviewsCount || 0} reviews)</span>
                  </div>
                  <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin className="w-4 h-4" />{profile.city}</span>
                  <span className="flex items-center gap-1 text-gray-500 text-sm"><Languages className="w-4 h-4" />{profile.languages?.join(', ') || 'Hindi'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 w-full md:w-56 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-5 py-3 text-center">
                  <span className="text-2xl font-extrabold text-green-700">₹{profile.charges || 1100}</span>
                  <span className="text-green-600 text-xs ml-1">/ pooja</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    disabled={submittingFavorite}
                    title="Add to Favorites"
                    className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all flex-shrink-0 ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                  <Link
                    to={`/book/${profile._id}`}
                    className="flex-1 bg-gradient-to-r from-[#800000] to-[#c05c29] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 shadow-md transition-opacity text-center flex items-center justify-center gap-2"
                  >
                    📅 Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              {/* Left: About + Services */}
              <div className="md:col-span-2 space-y-8">
                {/* About */}
                <section className="bg-saffron-50/40 rounded-2xl p-6 border border-saffron-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BadgeInfo className="text-saffron-500 w-5 h-5" /> About Pandit Ji
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {profile.bio || 'Experienced Vedic pandit dedicated to conducting poojas with utmost authenticity, devotion, and Vedic tradition.'}
                  </p>
                </section>

                {/* Services */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Services Offered</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.specialization?.map(t => (
                      <div key={t} className="bg-white p-4 border border-saffron-100 rounded-xl flex justify-between items-center group hover:border-saffron-400 hover:shadow-sm transition-all">
                        <span className="font-medium text-gray-800 text-sm">{t}</span>
                        <Link
                          to={`/book/${profile._id}?type=${encodeURIComponent(t)}`}
                          className="text-xs font-bold text-saffron-600 bg-saffron-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-saffron-500 hover:text-white"
                        >
                          Book
                        </Link>
                      </div>
                    ))}
                    {(!profile.specialization || profile.specialization.length === 0) && (
                      <div className="text-gray-400 italic text-sm">No specific poojas listed yet.</div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right: At a Glance */}
              <aside className="space-y-5">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">At a Glance</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin className="text-saffron-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Location</div>
                        <div className="font-semibold text-gray-800">{profile.city}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Languages className="text-saffron-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Languages</div>
                        <div className="font-semibold text-gray-800">{profile.languages?.join(', ') || 'Hindi'}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="text-amber-400 fill-amber-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Rating</div>
                        <div className="font-semibold text-gray-800">{profile.rating > 0 ? `${profile.rating} / 5` : 'Not rated yet'}</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <User2 className="text-saffron-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Experience</div>
                        <div className="font-semibold text-gray-800">{profile.experience} Years</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="text-saffron-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Contact Number</div>
                        <div className="font-semibold text-gray-800">{profile.user?.mobile || 'Not provided'}</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Rate summary box */}
                {profile.reviewsCount > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
                    <div className="text-4xl font-extrabold text-amber-600">{profile.rating}</div>
                    <div className="flex justify-center mt-1">{renderStars(profile.rating)}</div>
                    <div className="text-sm text-amber-700 mt-1">{profile.reviewsCount} Customer Reviews</div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Write a Review */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Write a Review</h2>
              <p className="text-gray-400 text-sm mb-5">Share your experience with Pandit Ji</p>

              {!isLoggedIn ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🙏</div>
                  <p className="text-gray-500 text-sm mb-4">Please login to write a review.</p>
                  <Link to="/login" className="inline-block bg-[#DA6626] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md">
                    Login to Review
                  </Link>
                </div>
              ) : (
                <form onSubmit={submitReview} className="space-y-4">
                  {/* Star selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                    <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
                    {reviewRating > 0 && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]} — {reviewRating}/5
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comment *</label>
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Describe your experience with this pandit..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 resize-none transition-all"
                    />
                  </div>

                  {/* Error / Success */}
                  <AnimatePresence>
                    {reviewError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                      >
                        {reviewError}
                      </motion.p>
                    )}
                    {reviewSuccess && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-green-700 text-sm bg-green-50 border border-green-100 rounded-lg px-3 py-2"
                      >
                        {reviewSuccess}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-gradient-to-r from-[#800000] to-[#c05c29] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-opacity disabled:opacity-60"
                  >
                    {reviewLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Review</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Reviews <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-gray-500 font-medium">No reviews yet.</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
