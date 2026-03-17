import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const stats = [
    { emoji: '🐾', number: '200+', label: 'Pets Adopted' },
    { emoji: '🏠', number: '150+', label: 'Happy Homes' },
    { emoji: '❤️', number: '50+', label: 'Awaiting You' },
  ];

  const steps = [
    { emoji: '🔍', title: 'Browse', desc: 'Explore pets by species, breed, age and more.' },
    { emoji: '📝', title: 'Apply', desc: 'Fill out a quick adoption application.' },
    { emoji: '✅', title: 'Get Approved', desc: 'Our team reviews and responds quickly.' },
    { emoji: '🏡', title: 'Bring Home', desc: 'Welcome your new family member!' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-paws">🐾🐾🐾🐾🐾🐾🐾🐾🐾🐾🐾🐾</div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Find your perfect companion</p>
            <h1 className="hero-title">Every Pet Deserves<br /><em>A Loving Home</em></h1>
            <p className="hero-sub">Connecting animals in need with caring families. Browse our shelter pets and give them the life they deserve.</p>
            <div className="hero-actions">
              <Link to="/pets" className="btn btn-primary btn-lg">Browse Pets 🐾</Link>
              {!user && <Link to="/register" className="btn btn-secondary btn-lg">Join Us</Link>}
            </div>
          </div>
          <div className="hero-img-wrap">
            <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&auto=format" alt="Happy pets" className="hero-img" />
            <div className="hero-img-badge">
              <span>💛</span>
              <div>
                <strong>Trusted Shelter</strong>
                <span>Since 2018</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-emoji">{s.emoji}</span>
              <strong className="stat-number">{s.number}</strong>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">Adopting a pet has never been easier</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.title} className="step-card">
                <div className="step-number">{i + 1}</div>
                <div className="step-emoji">{s.emoji}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to Meet Your New Best Friend?</h2>
            <p>Hundreds of loving animals are waiting for a home just like yours.</p>
          </div>
          <Link to="/pets" className="btn btn-primary btn-lg">Find Your Pet →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
