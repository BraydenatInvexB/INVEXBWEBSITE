import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTracker from './components/PageTracker';
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import MarketingPage from './pages/Marketing';
import Telesales from './pages/Telesales';
import ContactPage from './pages/Contact';
import Configurator from './pages/Configurator';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <PageTracker />
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/telesales" element={<Telesales />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/configurator" element={<Configurator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
