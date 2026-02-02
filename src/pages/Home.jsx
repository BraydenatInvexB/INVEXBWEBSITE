import Hero from '../components/Hero';
import Services from '../components/Services';
import Marketing from '../components/Marketing';
import Features from '../components/Features';
import WhyTrustUs from '../components/WhyTrustUs';
import TechStack from '../components/TechStack';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import WhatsAppButton from '../components/WhatsAppButton';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Services />
      <Marketing />
      <Features />
      <WhyTrustUs />
      <TechStack />
      <FAQ />
      <CTA />
      <WhatsAppButton />
    </div>
  );
}

export default Home;
