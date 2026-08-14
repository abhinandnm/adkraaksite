import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ArrowRight, Phone, MessageSquare, Mail, ArrowDown,
  GraduationCap, Utensils, ClipboardCheck, FileSpreadsheet, Compass, Code2
} from 'lucide-react';
import Blob from './Blob';

// Scroll reveal observer hook for entering animations
function useScrollReveal(triggerDeps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [triggerDeps]); // Re-run when layout content expands
}

function useCustomCursor() {
  const posRef = useRef({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const cursorEl = useRef(null);

  useEffect(() => {
    // Direct DOM manipulation — zero React re-renders per mouse move
    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorEl.current) {
        cursorEl.current.style.left = e.clientX + 'px';
        cursorEl.current.style.top = e.clientY + 'px';
      }
    };

    const handleMouseOver = (e) => {
      const isInteractive =
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.classList.contains('product-tab-card') ||
        e.target.closest('.feature-item');
      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return { cursorEl, hovered };
}

export default function App() {
  const { cursorEl, hovered } = useCustomCursor();
  const [selectedProduct, setSelectedProduct] = useState(0); // default to first product expanded
  const [clickCoord, setClickCoord] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Hook scroll reveal
  useScrollReveal(selectedProduct);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  // Capture mouse clicks on tabs/features/buttons and transmit to 3D canvas
  const handleAppClick = (e) => {
    const isTab = e.target.closest('.product-tab-card');
    const isFeature = e.target.closest('.feature-item');
    const isCta = e.target.closest('.product-cta-btn') || e.target.closest('.btn-primary') || e.target.closest('.nav-cta');
    const isContactItem = e.target.closest('.contact-item') || e.target.closest('.submit-btn');

    if (isTab || isFeature || isCta || isContactItem) {
      // Get normalized cursor coordinates (-1 to 1) relative to screen
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setClickCoord({ x, y, time: Date.now() });
    }
  };

  const whatsappBaseUrl = "https://wa.me/917012837825";

  const products = [
    {
      num: "01 / 06",
      name: "EduNova",
      icon: GraduationCap,
      subtitle: "EDUNOVA · ATTENDANCE",
      tagline: "Complete school & college management.",
      features: [
        "Attendance, timetable, exams, auto report cards",
        "Fee collection with WhatsApp & email receipts",
        "Parent portal — real-time attendance, fees, marks",
        "Library, transport, staff & announcements"
      ],
      transition: "↓ School data flows away",
      whatsappText: "Hello Adkrak Team! I am interested in a demo of EduNova School Management System."
    },
    {
      num: "02 / 06",
      name: "RestoPOS",
      icon: Utensils,
      subtitle: "RESTOPOS · FLOOR + KDS",
      tagline: "Restaurant management from KOT to bill.",
      features: [
        "Multi-customer table billing with GST invoices",
        "Live Kitchen Display System with station routing",
        "Customer QR self-ordering (no app install)",
        "UPI, cash, card + role-based access"
      ],
      transition: "↓ Receipts become question cards",
      whatsappText: "Hello Adkrak Team! I am interested in a demo of RestoPOS Restaurant System."
    },
    {
      num: "03 / 06",
      name: "Exam Portal",
      icon: ClipboardCheck,
      subtitle: "EXAM PORTAL · PROCTORED",
      tagline: "Secure online examination platform.",
      features: [
        "MCQ, subjective & code question banks",
        "Timed tests with auto-submit and pause/resume",
        "AI-based proctoring — flags anomalies live",
        "Auto-grading + instant result publication"
      ],
      transition: "↓ Questions dissolve into reports",
      whatsappText: "Hello Adkrak Team! I am interested in a demo of your Exam Portal platform."
    },
    {
      num: "04 / 06",
      name: "Report Generation",
      icon: FileSpreadsheet,
      subtitle: "REPORT ENGINE · SCHEDULED",
      tagline: "Automated report engine for busy teams.",
      features: [
        "Pull from spreadsheets, databases, APIs",
        "Design once with reusable templates + branding",
        "Scheduled auto-generation, daily/weekly/monthly",
        "Branded PDF & Excel output, emailed on schedule"
      ],
      transition: "↓ Charts become roads",
      whatsappText: "Hello Adkrak Team! I am interested in a demo of your Automated Report Engine."
    },
    {
      num: "05 / 06",
      name: "Roadgenie",
      icon: Compass,
      subtitle: "ROADGENIE · LIVE TRACKING (SOS)",
      tagline: "All-in-one travel & roadside assistance.",
      features: [
        "Bus package comparison across operators",
        "Real-time GPS tracking shared with family",
        "24×7 roadside help — tow, fuel, mechanic",
        "One-tap SOS with nearest-help routing"
      ],
      transition: "↓ Roads transform into circuits",
      whatsappText: "Hello Adkrak Team! I am interested in a demo of Roadgenie travel assistance."
    },
    {
      num: "06 / 06",
      name: "Custom Web Dev",
      icon: Code2,
      subtitle: "CUSTOM BUILD · DEPLOYING",
      tagline: "Bespoke web apps for businesses that need one.",
      features: [
        "Marketing sites, dashboards, portals, e-commerce",
        "Modern stack — Next.js, React, Supabase, Cloudflare",
        "Payment, WhatsApp, SMS, Google & UPI integrations",
        "Fixed price, fixed timeline, code you own"
      ],
      transition: null,
      whatsappText: "Hello Adkrak Team! I want to talk about building a custom web project with you."
    }
  ];

  const founders = [
    {
      initials: "AD",
      name: "Adarsh P Pradeep",
      image: "/adarsh.png",
      tapeGradient: "linear-gradient(135deg, #2BB381, #44F1A6)",
      role: "Founder · CEO · CTO",
      desc: "Engineer and founder. Leads product architecture, engineering, and the technology roadmap at Adkrak.",
      quote: "Great software should feel invisible — it does its job, then gets out of the way. Every feature we ship gets measured by that one bar."
    },
    {
      initials: "KR",
      name: "Jaikrishna Jayan",
      image: "/jaikrishna.png",
      tapeGradient: "linear-gradient(135deg, #0d4631, #2BB381)",
      role: "Founder · CEO · CFO",
      desc: "Finance and operations. Runs the numbers, the runway, and the promises we make to our customers.",
      quote: "Every rupee our customers spend with us should return ten-fold in time saved and productivity gained. That's the deal — and we hold ourselves to it."
    },
    {
      initials: "AK",
      name: "Akash Harikumar",
      image: "/akash.png",
      tapeGradient: "linear-gradient(135deg, #2BB381, #ECC94B)",
      role: "Founder · CEO · CMO",
      desc: "Brand, marketing and customer growth. Owns how the world hears about Adkrak.",
      quote: "We're building for the everyday industries — the restaurants, schools and roads that make real life happen. They deserve tools as good as their work."
    }
  ];

  return (
    <div className="app-container" onClick={handleAppClick}>
      {/* Premium custom mouse cursor pointer */}
      <div
        ref={cursorEl}
        className={`custom-cursor ${hovered ? 'hovered' : ''}`}
      />

      {/* fixed 3D background WebGL deck */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#2BB381" />
          <Blob clickCoord={clickCoord} selectedProduct={selectedProduct} />
        </Canvas>
      </div>

      {/* HTML Layout Content Deck */}
      <div className="content-overlay">

        {/* Navigation Header */}
        <header className="header">
          <a href="#" className="logo">adkrak.</a>
          <nav className="nav-links">
            <a href="#products" className="nav-link">Products</a>
            <a href="#founders" className="nav-link">Founders</a>
            <a href="#contact" className="nav-link">Contact</a>
            <a
              href={whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
            >
              Talk to a founder
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <span className="hero-sub reveal">Adkrak Innovations Pvt Ltd</span>
          <h1 className="hero-title reveal">Your Vision, Architected<br />to<br />Perfection.</h1>
          <p className="hero-desc reveal">
            Vertical SaaS for restaurants, schools, exams and roads.<br />
            Mobile-first, India-priced, built in Kerala.
          </p>
          <div className="hero-ctas reveal">
            <a href="#products" className="btn-primary">
              Explore products <ArrowDown size={18} />
            </a>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section id="products" className="ecosystem-section">
          <span className="section-tag reveal">The Ecosystem</span>
          <h2 className="section-title reveal">Six products. One standard.</h2>

          {/* Grid list of small icons & titles */}
          <div className="products-grid reveal">
            {products.map((product, idx) => {
              const ProductIcon = product.icon;
              const isSelected = selectedProduct === idx;
              return (
                <button
                  key={idx}
                  className={`product-tab-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedProduct(isSelected ? null : idx)}
                >
                  <div className="product-tab-header">
                    <span className="product-tab-num">{product.num.split(' ')[0]}</span>
                    <ProductIcon className="product-tab-icon" size={24} />
                  </div>
                  <span className="product-tab-title">{product.name}</span>
                </button>
              );
            })}
          </div>

          {/* Expanded detail panel with animations */}
          <div className="product-details-container reveal">
            {products.map((product, idx) => {
              const isSelected = selectedProduct === idx;
              return (
                <div
                  key={idx}
                  className={`product-details-panel ${isSelected ? 'show' : ''}`}
                >
                  {isSelected && (
                    <>
                      <div className="product-details-layout">
                        <div className="product-info-left reveal">
                          <span className="product-num">{product.num}</span>
                          <h3 className="product-name">{product.name}</h3>
                          <span className="product-status">● Active</span>
                          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', letterSpacing: '0.05em' }}>
                            {product.subtitle}
                          </p>
                          <p className="product-tagline">{product.tagline}</p>
                        </div>
                        <div className="product-features-right reveal">
                          <ul className="features-list">
                            {product.features.map((feature, fIdx) => (
                              <li className="feature-item" key={fIdx}>
                                <span className="feature-bullet" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={`${whatsappBaseUrl}?text=${encodeURIComponent(product.whatsappText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="product-cta-btn"
                          >
                            Request A Demo <ArrowRight size={16} />
                          </a>
                        </div>
                      </div>
                      {product.transition && (
                        <div className="transition-line reveal" style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                          {product.transition}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Founders Section */}
        <section id="founders" className="founders-section">
          <span className="section-tag reveal">The Founders</span>
          <h2 className="section-title reveal">AD · KR · AK</h2>

          <div className="founders-grid">
            {founders.map((founder, idx) => (
              <div className="founder-card reveal" key={idx}>
                {/* Top: Polaroid Frame */}
                <div className={`founder-polaroid-frame polaroid-tilt-${idx}`}>
                  <div className="founder-polaroid-img-wrapper">
                    {founder.image ? (
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="founder-polaroid-img"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="founder-polaroid-placeholder">
                        {founder.initials}
                      </div>
                    )}
                  </div>
                  <div className="polaroid-caption">{founder.initials} · {idx + 1}</div>
                </div>

                {/* Bottom: Details Content */}
                <div className="founder-card-content">
                  <div>
                    <div className="founder-card-header">
                      <h3 className="founder-name">{founder.name}</h3>
                      <span className="founder-card-badge-inline">{founder.initials}</span>
                    </div>
                    <span className="founder-role">{founder.role}</span>
                    <p className="founder-desc">
                      {founder.desc}
                    </p>
                  </div>
                  <blockquote className="founder-quote-text">
                    {founder.quote}
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Footer Section */}
        <section id="contact" className="contact-section">
          <div className="contact-layout">
            <div className="contact-details">
              <div>
                <span className="section-tag reveal">Get in Touch</span>
                <h2 className="contact-heading reveal">Founders take every inbound.</h2>
                <p className="contact-sub reveal">No sales funnel, no chatbot. Pick a channel and you reach one of us directly.</p>
              </div>

              <div className="contact-channels reveal">
                <a
                  href={`${whatsappBaseUrl}?text=${encodeURIComponent("Hello! I'd like to get in touch with a founder.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <div className="contact-icon-wrapper">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <div className="contact-info-title">Message a founder</div>
                    <div className="contact-info-val">Direct Line · Fastest Reply</div>
                  </div>
                </a>

                <a href="tel:+917012837825" className="contact-item">
                  <div className="contact-icon-wrapper">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="contact-info-title">Call Us</div>
                    <div className="contact-info-val">+91 70128 37825</div>
                  </div>
                </a>

                <a href="mailto:enquiry@adkrak.in" className="contact-item">
                  <div className="contact-icon-wrapper">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="contact-info-title">Email enquiry</div>
                    <div className="contact-info-val">enquiry@adkrak.in</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="reveal">
              {formSubmitted ? (
                <div className="contact-form" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h3 className="founder-name" style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Thanks for reaching out. A founder will contact you within a business day.</p>
                  </div>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">How can we help?</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell us about your project"
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              )}
            </div>
          </div>

          <div className="footer-bottom reveal">
            <div className="footer-copy">
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>adkrak.</p>
              <p>© {new Date().getFullYear()} Adkrak Innovations Pvt Ltd. All rights reserved.</p>
            </div>
            <div className="footer-badge">
              <span>🇮🇳 Made in India · Built in Kerala</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
