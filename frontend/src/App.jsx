import { Route, Routes } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Contact from './pages/Contact';
import AdminHotels from './pages/AdminHotels';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
