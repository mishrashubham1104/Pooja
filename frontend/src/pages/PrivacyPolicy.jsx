import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="bg-cream-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <span className="text-4xl">🔒</span>
            <h1 className="text-3xl font-extrabold text-maroon-600 mt-4">Privacy Policy</h1>
            <p className="text-gray-400 text-sm mt-2">Last updated: April 15, 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-[15px] leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Personal Information:</strong> Name, email address, mobile number when you create an account.</li>
                <li><strong>Profile Information:</strong> City, experience, specialization, bio (for Pandits).</li>
                <li><strong>Booking Information:</strong> Service type, date, time, address, payment details.</li>
                <li><strong>Reviews:</strong> Ratings and comments you submit about Pandits.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide, maintain, and improve our services.</li>
                <li>To process bookings and facilitate communication between customers and Pandits.</li>
                <li>To send you notifications about your bookings and account.</li>
                <li>To display public-facing Pandit profiles to customers.</li>
                <li>To analyze platform usage and improve user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
              <p>We do not sell your personal information to third parties. We may share your information in the following cases:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>With Pandits when you make a booking (name, address, contact for service delivery).</li>
                <li>With customers when a Pandit profile is viewed (profile details, specialization).</li>
                <li>When required by law or to protect our legal rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of internet transmission is 100% secure. We use JWT-based authentication and encrypted password storage to protect your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You can access and update your personal information through your account settings.</li>
                <li>You can request deletion of your account by contacting our support team.</li>
                <li>You can opt out of promotional communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
              <p>We use local storage to maintain your login session. We do not use tracking cookies or share data with advertising networks.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, contact us at <span className="text-saffron-600 font-semibold">privacy@poojaconnect.com</span></p>
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
