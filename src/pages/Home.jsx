import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <Services />
    </div>
  );
}

export default Home;
