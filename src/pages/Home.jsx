import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import WhatsAppButton from '../components/WhatsAppButton';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <Services />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
