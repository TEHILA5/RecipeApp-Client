import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import logo from '../../../assets/images/logoo.png';
import sweetyTip from '../../../assets/images/sweety-tip.png';
import starsImg from '../../../assets/images/stars.png';

export default function Hero() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">✿ Welcome to Sweet&Treat ✿</div>
          <h1 className="hero-title">
            Bake it with<br /><span>love & sugar</span>
          </h1>
          <p className="hero-desc">
            Dreamy dessert recipes crafted with care — from melt-in-your-mouth
            cookies to show-stopping layer cakes. Every sweet moment starts here.
          </p>
          <img src={starsImg} alt="5 stars" className="hero-stars" />
          <div className="hero-btns">
            {isAuthenticated ? (
              <>
                <Link to="/recipes" className="btn-pink">Browse Recipes</Link>
                <Link to="/search" className="btn-outline">Search Recipes ✦</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-pink">Get Started Free</Link>
                <Link to="/login" className="btn-outline">Sign In ✦</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-deco-blob" />
          <img src={logo} alt="Recipe Book" className="hero-book" />
        </div>
      </section>

      <section className="tip-bar">
        <img src={sweetyTip} alt="Sweety" className="sweety" />
        <div className="tip-content">
          <div className="tip-label">💡 Sweety's Tip</div>
          <p className="tip-text">
            Always <em>preheat your oven</em> 15 minutes before baking for the
            best results! A properly heated oven ensures even baking and perfect texture.
          </p>
        </div>
      </section>
    </>
  );
}
