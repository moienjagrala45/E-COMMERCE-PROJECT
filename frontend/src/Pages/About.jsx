import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="shopease-dark-root">
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. MAIN ABOUT CONTENT */}
      <main className="about-page-wrapper">
        {/* SECTION 1 — INTRODUCTION (CLEAN SPLIT LAYOUT) */}
        <section className="about-intro-section">
          <div className="about-intro-grid">
            {/* LEFT: NARRATIVE */}
            <div className="about-intro-text">
              <h1 className="about-main-title">
                Built around a <br />
                <span className="about-title-accent">simpler way to shop.</span>
              </h1>
              <p className="about-lead-desc">
                ShopEase is a student-built e-commerce experience focused on making product discovery straightforward. It brings technology, fashion, accessories and everyday essentials into one clean and easy-to-use shopping space.
              </p>
            </div>

            {/* RIGHT: ONE STRONG WORKSPACE/LIFESTYLE SCENE */}
            <div className="about-visual-frame">
              <img
                src="/about-workspace.png"
                alt="ShopEase modern development workspace"
                className="about-hero-img"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2 — WHY SHOPEASE EXISTS (TEXT-FOCUSED SECTION, NO CARD REQUIRED) */}
        <section className="about-philosophy-section">
          <div className="about-philosophy-inner">
            <h2 className="about-section-heading">Why ShopEase exists</h2>
            <p className="about-philosophy-text">
              Online stores can easily become crowded with offers, ratings, banners and unnecessary information. ShopEase was designed around a simpler idea — help people find products, understand the important details and move through the shopping process without unnecessary clutter.
            </p>
          </div>
        </section>

        {/* SECTION 3 — PROJECT FOCUS (THREE PURPOSEFUL AREAS) */}
        <section className="about-focus-section">
          <div className="about-focus-header">
            <h2 className="about-section-heading">What we focus on</h2>
          </div>

          <div className="about-focus-grid">
            <div className="about-focus-item">
              <h3 className="about-focus-title">Clarity</h3>
              <p className="about-focus-desc">
                Useful product information without unnecessary noise.
              </p>
            </div>

            <div className="about-focus-item">
              <h3 className="about-focus-title">Simplicity</h3>
              <p className="about-focus-desc">
                Straightforward navigation from discovery to checkout.
              </p>
            </div>

            <div className="about-focus-item">
              <h3 className="about-focus-title">Consistency</h3>
              <p className="about-focus-desc">
                A shopping experience that feels connected across products, cart and account.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 3. MAIN COMPLETE FOOTER */}
      <Footer />
    </div>
  );
}

export default About;
