import Marketing from '../components/Marketing';
import './MarketingPage.css';

function MarketingPage() {
  return (
    <div className="marketing-page">
      <section className="marketing-hero">
        <div className="marketing-hero-container">
          <h1 className="marketing-hero-title">Marketing Packages</h1>
          <p className="marketing-hero-subtitle">
            Social media management and full web presence packages. We manage your digital brand so you can focus on your business.
          </p>
        </div>
      </section>
      <Marketing />
    </div>
  );
}

export default MarketingPage;
