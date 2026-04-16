import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pandits from './pages/Pandits';
import Services from './pages/Services';
import PoojaDetails from './pages/PoojaDetails';
import PanditProfile from './pages/PanditProfile';
import Booking from './pages/Booking';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import PanditDashboard from './pages/dashboards/PanditDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Feedback from './pages/Feedback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pandits" element={<Pandits />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pooja/:id" element={<PoojaDetails />} />
          <Route path="/pandit/:id" element={<PanditProfile />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/pandit" element={<PanditDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
