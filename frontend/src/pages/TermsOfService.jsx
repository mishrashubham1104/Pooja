import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="bg-cream-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-4xl">📜</span>
            <h1 className="text-3xl font-extrabold text-maroon-600 mt-4">Terms of Service</h1>
            <p className="text-gray-400 text-sm mt-2">Last updated: April 15, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-[15px] leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using the Pooja Connect platform ("Service"), you accept and agree to be bound by the terms and conditions outlined in this agreement. If you do not agree to these terms, please do not use our Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
              <p>Pooja Connect is an online platform that connects customers seeking religious/spiritual services (Poojas, Havans, Paths, etc.) with registered and verified Pandits. We act as an intermediary and do not directly perform any religious ceremonies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must provide accurate and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You must be at least 18 years old to create an account.</li>
                <li>Each user may only maintain one account. Duplicate accounts may be suspended.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Booking & Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All bookings are subject to the availability of the Pandit.</li>
                <li>Prices displayed are indicative and may vary based on the type and complexity of the Pooja.</li>
                <li>Payment can be made via online methods or cash on service as available.</li>
                <li>Cancellation policies apply as per individual Pandit terms.</li>
                <li>Pooja Connect charges a convenience fee for facilitating the booking.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. For Pandits</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pandits must provide truthful information about their qualifications, experience, and specializations.</li>
                <li>Pandits are independent service providers, not employees of Pooja Connect.</li>
                <li>Pandits must honor confirmed bookings and maintain professional conduct.</li>
                <li>Pooja Connect reserves the right to remove profiles that violate our standards.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Reviews & Ratings</h2>
              <p>Customers may leave reviews and ratings after a completed service. Reviews must be honest, respectful, and based on genuine experiences. Pooja Connect reserves the right to remove reviews that are abusive, fraudulent, or violate community guidelines.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>Pooja Connect is not responsible for the quality, outcome, or any disputes arising from services performed by Pandits. We facilitate connections but do not guarantee specific results from any religious ceremony.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at <span className="text-saffron-600 font-semibold">support@poojaconnect.com</span></p>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/" className="inline-block bg-gradient-to-r from-[#800000] to-[#c05c29] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
