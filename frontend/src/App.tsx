import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ServiceDetails from "./pages/ServiceDetails";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
