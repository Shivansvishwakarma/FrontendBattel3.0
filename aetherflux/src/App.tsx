import React, { useState, useEffect, useRef } from 'react';
import {
  SyncIcon,
  TrendingIcon,
  PieIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GearIcon,
  CubeIcon,
  ChainLinkIconA,
  SearchIcon,
  CloseIcon,
  ShieldIcon,
  ZapIcon,
  CheckIcon
} from './components/Icons';

// --- DESIGN TOKENS CHECKLIST ---
// Color Palette:
// --color-arctic-powder:    #F1F6F4;
// --color-mystic-mint:      #D9E8E2;
// --color-forsythia:        #FFC801;
// --color-deep-saffron:     #FF9932;
// --color-nocturnal-exp:    #114C5A;
// --color-oceanic-noir:     #172B36;

// --- FEATURE 1: PRICING ENGINE CONFIG ---
const PRICING_MATRIX = {
  tiers: {
    starter: { baseMonthlyUSD: 29 },
    pro:     { baseMonthlyUSD: 79 },
    scale:   { baseMonthlyUSD: 199 },
  },
  billing: {
    monthly: { multiplier: 1 },
    annual:  { multiplier: 0.8 }, // 20% discount
  },
  currency: {
    USD: { symbol: '$', tariff: 1.00 },
    INR: { symbol: '₹', tariff: 83.5 },
    EUR: { symbol: '€', tariff: 0.92 },
  }
};

function computePrice(tier: 'starter' | 'pro' | 'scale', billing: 'monthly' | 'annual', currency: 'USD' | 'INR' | 'EUR') {
  const base    = PRICING_MATRIX.tiers[tier].baseMonthlyUSD;
  const bMult   = PRICING_MATRIX.billing[billing].multiplier;
  const cMult   = PRICING_MATRIX.currency[currency].tariff;
  return Math.round(base * bMult * cMult);
}

// --- FEATURE 2: BENTO CONTENT ---
const FEATURES_DATA = [
  {
    index: 0,
    title: "Automated Data Streams",
    subtitle: "Sync pipelines in real-time",
    description: "Connect all your database endpoints instantly. Deliver over 10M+ events per second with automatic backpressure sensing and self-correcting schema alignment.",
    badge: "High-Throughput",
    iconName: "sync"
  },
  {
    index: 1,
    title: "Predictive Analytics Engine",
    subtitle: "Automatic ML projections",
    description: "Generate instant forecasts right on ingestion. Detect regression drift, anomaly spikes, and seasonal variance without any manual configuration.",
    badge: "Intelligence",
    iconName: "pie"
  },
  {
    index: 2,
    title: "Autonomous DB Schemas",
    subtitle: "Zero-migration schema scaling",
    description: "Let AetherFlux handle schema updates dynamically based on incoming structures. No downtime, no DB lockups, total data agility.",
    badge: "Scale",
    iconName: "cube"
  },
  {
    index: 3,
    title: "Zero-Code Connectors",
    subtitle: "200+ native integrations",
    description: "Link relational stores, cloud warehouses, and custom APIs seamlessly. Self-negotiating connectors translate structures automatically.",
    badge: "Universal",
    iconName: "chain"
  },
  {
    index: 4,
    title: "Natural Language SQL",
    subtitle: "Query using plain English",
    description: "Translate normal business queries into highly optimized multi-join SQL. Instant semantic analysis ensures flawless enterprise querying.",
    badge: "Empowerment",
    iconName: "search"
  },
  {
    index: 5,
    title: "Self-Healing Workflows",
    subtitle: "Automatic error mitigation",
    description: "Define workflows as visual steps. When third-party API payloads change or fail, AetherFlux intercepts, self-patches, and completes safely.",
    badge: "Resilience",
    iconName: "gear"
  }
];

export default function App() {
  // Page entry sequence trigger
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // --- MOBILE NAV STATE ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- FEATURE 1: PRICING ENGINE ENVELOPE (REFS) ---
  const billingCycleRef = useRef<'monthly' | 'annual'>('monthly');
  const currencyRef = useRef<'USD' | 'INR' | 'EUR'>('USD');

  // DOM node price containers
  const starterPriceSpanRef = useRef<HTMLSpanElement>(null);
  const proPriceSpanRef = useRef<HTMLSpanElement>(null);
  const scalePriceSpanRef = useRef<HTMLSpanElement>(null);

  // DOM node subtext billings
  const starterSubtextRef = useRef<HTMLSpanElement>(null);
  const proSubtextRef = useRef<HTMLSpanElement>(null);
  const scaleSubtextRef = useRef<HTMLSpanElement>(null);

  // Synchronous Direct DOM Price Mutator
  const performDirectDOMPriceUpdate = () => {
    const cycle = billingCycleRef.current;
    const cur = currencyRef.current;
    const symbol = PRICING_MATRIX.currency[cur].symbol;

    const priceStarter = computePrice('starter', cycle, cur);
    const pricePro = computePrice('pro', cycle, cur);
    const priceScale = computePrice('scale', cycle, cur);

    // Write text values directly into DOM text nodes
    if (starterPriceSpanRef.current) {
      starterPriceSpanRef.current.textContent = `${symbol}${priceStarter}`;
    }
    if (proPriceSpanRef.current) {
      proPriceSpanRef.current.textContent = `${symbol}${pricePro}`;
    }
    if (scalePriceSpanRef.current) {
      scalePriceSpanRef.current.textContent = `${symbol}${priceScale}`;
    }

    // Write subtext details
    if (starterSubtextRef.current) {
      if (cycle === 'annual') {
        const totalYearly = priceStarter * 12;
        starterSubtextRef.current.textContent = `Billed as ${symbol}${totalYearly}/year`;
      } else {
        starterSubtextRef.current.textContent = 'Billed monthly';
      }
    }
    if (proSubtextRef.current) {
      if (cycle === 'annual') {
        const totalYearly = pricePro * 12;
        proSubtextRef.current.textContent = `Billed as ${symbol}${totalYearly}/year`;
      } else {
        proSubtextRef.current.textContent = 'Billed monthly';
      }
    }
    if (scaleSubtextRef.current) {
      if (cycle === 'annual') {
        const totalYearly = priceScale * 12;
        scaleSubtextRef.current.textContent = `Billed as ${symbol}${totalYearly}/year`;
      } else {
        scaleSubtextRef.current.textContent = 'Billed monthly';
      }
    }
  };

  // Run on mount to guarantee correct initialization
  useEffect(() => {
    performDirectDOMPriceUpdate();
  }, []);

  // --- FEATURE 2: BENTO TO ACCORDION WITH CONTEXT LOCK ---
  const activeDesktopIndexRef = useRef<number | null>(0);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  // Handle active bento nodes hovered
  const handleBentoHover = (index: number) => {
    activeDesktopIndexRef.current = index;
    // Set active style dynamically via simple DOM checks or React state
    // Let's modify classes on actual bento nodes to keep it instantaneous and bypass React renders
    FEATURES_DATA.forEach((feat) => {
      const node = document.getElementById(`bento-node-${feat.index}`);
      if (node) {
        if (feat.index === index) {
          node.classList.add('bento-node--active', 'border-forsythia', 'bg-nocturnal-exp/90');
          node.classList.remove('border-white/5', 'bg-nocturnal-exp/30');
        } else {
          node.classList.remove('bento-node--active', 'border-forsythia', 'bg-nocturnal-exp/90');
          node.classList.add('border-white/5', 'bg-nocturnal-exp/30');
        }
      }
    });
  };

  // Set initial bento hover styling on load
  useEffect(() => {
    handleBentoHover(0);
  }, []);

  // Context lock listener
  useEffect(() => {
    let prevWidth = window.innerWidth;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        // Check if transition went past mobile breakpoint (< 768px)
        if (width < 768 && prevWidth >= 768) {
          const lastHovered = activeDesktopIndexRef.current;
          if (lastHovered !== null) {
            setOpenAccordionIndex(lastHovered);
            // Smoothly scroll the synchronized accordion item into view
            setTimeout(() => {
              const accordionElement = document.getElementById(`accordion-item-${lastHovered}`);
              if (accordionElement) {
                accordionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 150);
          }
        }
        prevWidth = width;
      }
    });

    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Toggle active accordion on click
  const toggleAccordion = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    // Sync the active bento reference back too
    activeDesktopIndexRef.current = index;
  };

  // Render specific icons based on name
  const renderIcon = (iconName: string, className = "w-6 h-6 text-forsythia") => {
    switch (iconName) {
      case 'sync': return <SyncIcon className={className} />;
      case 'pie': return <PieIcon className={className} />;
      case 'cube': return <CubeIcon className={className} />;
      case 'chain': return <ChainLinkIconA className={className} />;
      case 'search': return <SearchIcon className={className} />;
      case 'gear': return <GearIcon className={className} />;
      default: return <SyncIcon className={className} />;
    }
  };

  // --- SOCIAL PROOF: CUSTOM TESTIMONIAL CAROUSEL STATE ---
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const TESTIMONIALS = [
    {
      quote: "AetherFlux cut our enterprise stream integration pipeline from months to under 12 minutes. The autonomous SQL bridges represent real technical wizardry.",
      author: "Dr. Evelyn Thorne",
      title: "VP of Engineering, Globex Systems",
      initials: "ET"
    },
    {
      quote: "No migration lockups, no schema failures, and zero database freezes. Our analytics pipelines scale dynamically with incoming load spikes.",
      author: "Marcus Vance",
      title: "Lead Infrastructure Architect, Acme Labs",
      initials: "MV"
    },
    {
      quote: "With the multi-currency pricing switcher and robust billing engine, we knew exactly what we were scaling into. Best decision of the fiscal year.",
      author: "Serena Kincaid",
      title: "Chief Data Officer, Umbrellacorp",
      initials: "SK"
    }
  ];

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  // --- CONVERSION FORM STATUS ---
  const [emailValue, setEmailValue] = useState("");
  const [subscribedStatus, setSubsubscribedStatus] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setSubsubscribedStatus(true);
      setEmailValue("");
      setTimeout(() => setSubsubscribedStatus(false), 5000);
    }
  };

  return (
    <div className={`min-h-screen bg-oceanic-noir font-body text-arctic-powder transition-all duration-300 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* --- HEADER / NAVIGATION (SEMANTIC & SHALLOW NESTED) --- */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-oceanic-noir/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Global Navigation">
          <a href="#" id="navbar-logo" className="flex items-center gap-3 transition-hover hover:opacity-85 focus:outline-none">
            {/* AetherFlux Logo Icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-forsythia">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="font-display text-xl font-bold tracking-tight text-white">AetherFlux</span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li><a href="#features" className="transition-hover hover:text-forsythia">Features</a></li>
            <li><a href="#social-proof" className="transition-hover hover:text-forsythia">Testimonials</a></li>
            <li><a href="#pricing" className="transition-hover hover:text-forsythia">Pricing</a></li>
            <li><a href="#cta" className="transition-hover hover:text-forsythia font-semibold">Integrations</a></li>
          </ul>

          {/* Desktop Call To Action */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#pricing" className="text-sm font-medium transition-hover hover:text-forsythia">Sign In</a>
            <a href="#pricing" id="desktop-cta-btn" className="rounded-lg bg-forsythia px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-nocturnal-exp shadow-sm transition-hover hover:bg-deep-saffron hover:shadow-md focus:ring-2 focus:ring-forsythia">
              Launch Platform
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-nocturnal-exp md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>

        {/* Mobile Flyout Drawer */}
        <aside
          id="mobile-menu"
          className={`absolute top-0 left-0 w-full bg-oceanic-noir p-6 border-b border-nocturnal-exp/80 shadow-lg md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="font-display font-bold text-white">Navigation</span>
            <button onClick={() => setMobileMenuOpen(false)} className="h-8 w-8 flex justify-center items-center rounded-full bg-nocturnal-exp/50">
              <CloseIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <ul className="flex flex-col gap-4 text-base font-medium mb-6">
            <li><a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-forsythia">Features</a></li>
            <li><a href="#social-proof" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-forsythia">Testimonials</a></li>
            <li><a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-forsythia">Pricing</a></li>
            <li><a href="#cta" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-forsythia">Deploy Streams</a></li>
          </ul>
          <div className="flex flex-col gap-3">
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-white/20 font-medium text-sm">Sign In</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-forsythia font-display font-bold text-sm text-nocturnal-exp uppercase tracking-wider">Launch Free Trial</a>
          </div>
        </aside>
      </header>

      {/* --- MAIN PAGE LAYOUT --- */}
      <main>

        {/* --- SECTION: HERO AREA --- */}
        <section id="hero" className="relative overflow-hidden py-16 md:py-28 px-6 bg-gradient-to-b from-oceanic-noir to-nocturnal-exp/40">
          <article className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy Block */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-forsythia border border-white/10">
                <span className="h-2 w-2 rounded-full bg-deep-saffron animate-ping" />
                AetherFlux v2.4 Live
              </span>
              
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                Autonomous Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-forsythia to-deep-saffron">Automation</span>
              </h1>
              
              <p className="font-body text-lg md:text-xl text-arctic-powder/80 leading-relaxed max-w-2xl">
                Consolidate complex processing pipelines, construct real-time ML integrations, and normalize relational databases dynamically. Designed for speed, tested for performance, built for scale.
              </p>

              {/* CTA Row (div layers strictly shallow) */}
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <a href="#pricing" className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-forsythia px-8 py-4 font-display font-bold uppercase tracking-wider text-nocturnal-exp shadow-md hover:bg-deep-saffron transition-hover">
                  Deploy Free Cluster
                </a>
                <a href="#features" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-xl bg-nocturnal-exp border border-mystic-mint/20 px-8 py-4 font-medium text-arctic-powder shadow-sm hover:bg-nocturnal-exp/70 transition-hover">
                  See Features
                  <TrendingIcon className="w-4 h-4" />
                </a>
              </div>

              {/* Minimalist Microstats Block */}
              <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10 w-full max-w-md">
                <aside>
                  <p className="font-display text-2xl font-bold text-white">10M+</p>
                  <p className="font-body text-xs text-mystic-mint/60">Events / Second</p>
                </aside>
                <aside>
                  <p className="font-display text-2xl font-bold text-white">&lt;3ms</p>
                  <p className="font-body text-xs text-mystic-mint/60">Global Latency</p>
                </aside>
                <aside>
                  <p className="font-display text-2xl font-bold text-white">99.99%</p>
                  <p className="font-body text-xs text-mystic-mint/60">Uptime Guarantee</p>
                </aside>
              </div>
            </div>

            {/* Right Interactive Visual Simulator */}
            <div className="lg:col-span-5 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-nocturnal-exp rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden border-4 border-oceanic-noir animate-fade-in-up delay-100">
              {/* Simulator Header */}
              <header className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 gap-1">
                    <span className="rounded-full bg-red-400 h-2 w-2" />
                    <span className="rounded-full bg-yellow-400 h-2 w-2" />
                    <span className="rounded-full bg-green-400 h-2 w-2" />
                  </span>
                  <span className="font-display text-xs text-white/50">aetherflux-cluster-04 // active</span>
                </div>
                <span className="rounded bg-forsythia/20 px-2 py-0.5 font-display text-[10px] uppercase font-bold tracking-wider text-forsythia">
                  Live Flow
                </span>
              </header>

              {/* Animated Network Pipeline Visualizer */}
              <div className="flex-1 relative flex items-center justify-between px-4 py-8">
                {/* Visualizer Back Grid Lines */}
                <span className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Left Source Node */}
                <div className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
                  <CubeIcon className="w-6 h-6 text-forsythia" />
                  <span className="font-display text-[10px] text-white/80">API_GATE</span>
                </div>

                {/* Center Processing Pipeline (Animated SVG Line) */}
                <div className="flex-1 relative h-16 flex items-center">
                  <svg className="w-full h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,24 Q30,4 60,24 T120,24" stroke="rgba(255, 200, 1, 0.2)" strokeWidth="4" strokeLinecap="round" />
                    <path d="M0,24 Q30,4 60,24 T120,24" stroke="url(#gradient-line)" strokeWidth="4" strokeLinecap="round" strokeDasharray="15 100" strokeDashoffset="0">
                      <animate attributeName="strokeDashoffset" values="115;0" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    <defs>
                      <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFC801" />
                        <stop offset="100%" stopColor="#FF9932" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute left-1/2 -translate-x-1/2 bg-deep-saffron text-nocturnal-exp font-display text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-bounce">
                    AI Auto-Map
                  </span>
                </div>

                {/* Right Target Node */}
                <div className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-1">
                  <SyncIcon className="w-6 h-6 text-deep-saffron" />
                  <span className="font-display text-[10px] text-white/80">POSTGRES</span>
                </div>
              </div>

              {/* Simulator Footer */}
              <footer className="border-t border-white/10 pt-4 flex justify-between items-center text-white/60">
                <aside className="flex flex-col">
                  <span className="font-body text-[10px] uppercase">Throughput</span>
                  <span className="font-display text-sm font-semibold text-white">48,290 EPS</span>
                </aside>
                <aside className="flex flex-col text-right">
                  <span className="font-body text-[10px] uppercase">Sync Latency</span>
                  <span className="font-display text-sm font-semibold text-forsythia">&lt;1.8ms</span>
                </aside>
              </footer>
            </div>

          </article>
        </section>

        {/* --- SECTION: BENTO / ACCORDION FEATURE SHOWCASE --- */}
        <section id="features" className="py-20 md:py-28 px-6 bg-oceanic-noir border-t border-white/5">
          <article className="mx-auto max-w-7xl">
            
            {/* Features Title */}
            <header className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="rounded-full bg-nocturnal-exp px-4 py-1 text-xs font-semibold uppercase tracking-wider text-forsythia">
                Features Portfolio
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white max-w-3xl">
                One Autonomous Core Engine. Six Seamless Superpowers.
              </h2>
              <p className="font-body text-base md:text-lg text-arctic-powder/70 max-w-xl">
                Hover or tap to toggle between active nodes and see how AetherFlux integrates your infrastructure with instant context transfer.
              </p>
            </header>

            {/* --- DESKTOP VIEW: ASYMMETRICAL BENTO GRID (>= 768px) --- */}
            <div className="hidden md:grid grid-cols-3 gap-6 auto-rows-auto" id="desktop-bento-grid">
              
              {/* Feature 0 (Sync - col-span-2) */}
              <div
                id="bento-node-0"
                data-index="0"
                onMouseEnter={() => handleBentoHover(0)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-2 transition-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                    {renderIcon('sync')}
                  </span>
                  <span className="font-display text-xs font-bold text-white/40 group-hover:text-white/60">01 / STREAMS</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES_DATA[0].title}</h3>
                <p className="font-body text-sm text-arctic-powder/75 leading-relaxed max-w-md">{FEATURES_DATA[0].description}</p>
                {/* Accent corner effect */}
                <span className="absolute bottom-0 right-0 h-1.5 w-0 bg-forsythia group-hover:w-full transition-all duration-300" />
              </div>

              {/* Feature 1 (Pie - col-span-1, row-span-2) */}
              <div
                id="bento-node-1"
                data-index="1"
                onMouseEnter={() => handleBentoHover(1)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-1 row-span-2 flex flex-col justify-between transition-hover"
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                      {renderIcon('pie')}
                    </span>
                    <span className="font-display text-xs font-bold text-white/40 group-hover:text-white/60">02 / INSIGHTS</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{FEATURES_DATA[1].title}</h3>
                  <p className="font-body text-sm text-arctic-powder/75 leading-relaxed">{FEATURES_DATA[1].description}</p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-4">
                  <span className="inline-block rounded-full bg-forsythia px-3 py-1 font-display text-[10px] font-bold uppercase text-nocturnal-exp">
                    {FEATURES_DATA[1].badge}
                  </span>
                </div>
                <span className="absolute bottom-0 left-0 h-full w-1 bg-forsythia/20 group-hover:bg-forsythia transition-hover" />
              </div>

              {/* Feature 2 (Cube - col-span-1) */}
              <div
                id="bento-node-2"
                data-index="2"
                onMouseEnter={() => handleBentoHover(2)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-1 transition-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                    {renderIcon('cube')}
                  </span>
                  <span className="font-display text-xs font-bold text-white/40">03 / DATABASE</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES_DATA[2].title}</h3>
                <p className="font-body text-sm text-arctic-powder/75 leading-relaxed">{FEATURES_DATA[2].description}</p>
                <span className="absolute top-0 right-0 h-1 w-0 bg-deep-saffron group-hover:w-1/2 transition-all duration-300" />
              </div>

              {/* Feature 3 (Chain - col-span-1) */}
              <div
                id="bento-node-3"
                data-index="3"
                onMouseEnter={() => handleBentoHover(3)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-1 transition-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                    {renderIcon('chain')}
                  </span>
                  <span className="font-display text-xs font-bold text-white/40">04 / BRIDGES</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES_DATA[3].title}</h3>
                <p className="font-body text-sm text-arctic-powder/75 leading-relaxed">{FEATURES_DATA[3].description}</p>
                <span className="absolute top-0 right-0 h-1 w-0 bg-deep-saffron group-hover:w-1/2 transition-all duration-300" />
              </div>

              {/* Feature 4 (Search - col-span-1) */}
              <div
                id="bento-node-4"
                data-index="4"
                onMouseEnter={() => handleBentoHover(4)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-1 transition-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                    {renderIcon('search')}
                  </span>
                  <span className="font-display text-xs font-bold text-white/40">05 / ANALYTICS</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES_DATA[4].title}</h3>
                <p className="font-body text-sm text-arctic-powder/75 leading-relaxed">{FEATURES_DATA[4].description}</p>
                <span className="absolute top-0 left-0 h-0 w-1 bg-forsythia group-hover:h-full transition-all duration-300" />
              </div>

              {/* Feature 5 (Gear - col-span-2) */}
              <div
                id="bento-node-5"
                data-index="5"
                onMouseEnter={() => handleBentoHover(5)}
                className="bento-node group relative overflow-hidden rounded-2xl bg-nocturnal-exp/30 p-8 border border-white/5 cursor-pointer col-span-2 transition-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="rounded-lg bg-white/5 p-3 text-forsythia group-hover:scale-110 transition-hover">
                    {renderIcon('gear')}
                  </span>
                  <span className="font-display text-xs font-bold text-white/40 group-hover:text-white/60">06 / RUNNERS</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">{FEATURES_DATA[5].title}</h3>
                <p className="font-body text-sm text-arctic-powder/75 leading-relaxed max-w-md">{FEATURES_DATA[5].description}</p>
                <span className="absolute bottom-0 right-0 h-1.5 w-0 bg-forsythia group-hover:w-full transition-all duration-300" />
              </div>

            </div>

            {/* --- MOBILE VIEW: SINGLE-OPEN TRANSITIONAL ACCORDION (< 768px) --- */}
            <article className="block md:hidden space-y-4" id="mobile-accordion-group">
              {FEATURES_DATA.map((feat) => {
                const isOpen = openAccordionIndex === feat.index;
                return (
                  <div
                    key={feat.index}
                    id={`accordion-item-${feat.index}`}
                    className={`rounded-2xl border transition-hover overflow-hidden ${isOpen ? 'border-forsythia bg-nocturnal-exp/85 shadow-md' : 'border-white/10 bg-nocturnal-exp/20'}`}
                  >
                    {/* Header Click Target */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(feat.index)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                    >
                      <span className="flex items-center gap-4">
                        <span className={`rounded-xl p-2.5 transition-hover ${isOpen ? 'bg-forsythia text-nocturnal-exp' : 'bg-white/5 text-forsythia'}`}>
                          {renderIcon(feat.iconName, "w-5 h-5")}
                        </span>
                        <span className="font-display text-base font-bold text-white">
                          {feat.title}
                        </span>
                      </span>
                      <span>
                        {isOpen ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-forsythia">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-forsythia/60">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </span>
                    </button>

                    {/* Accordion Content Panel (Using standard max-height pure CSS transition) */}
                    <div
                      className={`accordion-panel ${isOpen ? 'is-open' : ''}`}
                      style={{ maxHeight: isOpen ? '300px' : '0px' }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-white/5">
                        <p className="font-body text-sm text-arctic-powder/80 leading-relaxed mb-4">
                          {feat.description}
                        </p>
                        <span className="inline-block rounded-full bg-white/10 px-3 py-1 font-display text-[10px] font-bold uppercase text-forsythia">
                          {feat.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </article>

          </article>
        </section>

        {/* --- SECTION: SOCIAL PROOF --- */}
        <section id="social-proof" className="py-20 px-6 bg-gradient-to-b from-oceanic-noir to-nocturnal-exp/30">
          <article className="mx-auto max-w-7xl">
            
            {/* Tech Logo Cloud */}
            <div className="text-center mb-12">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-white/40 mb-8">
                TRUSTED BY LEADING DATA TEAMS WORLDWIDE
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
                {/* Logo 1 */}
                <div className="flex items-center gap-2 hover:opacity-100 transition-hover duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">Globex</span>
                </div>
                {/* Logo 2 */}
                <div className="flex items-center gap-2 hover:opacity-100 transition-hover duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                  </svg>
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">Initech</span>
                </div>
                {/* Logo 3 */}
                <div className="flex items-center gap-2 hover:opacity-100 transition-hover duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
                    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
                    <circle cx="12" cy="8" r="5" />
                  </svg>
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">Acme Corp</span>
                </div>
                {/* Logo 4 */}
                <div className="flex items-center gap-2 hover:opacity-100 transition-hover duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-white">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-white">Umbrella</span>
                </div>
              </div>
            </div>

            {/* Testimonials Slider (Semantic & Non-div overloaded) */}
            <div className="max-w-4xl mx-auto bg-nocturnal-exp/60 rounded-3xl p-8 md:p-12 border border-white/5 relative">
              <span className="absolute top-6 left-8 text-6xl font-display font-bold text-white/5 pointer-events-none">“</span>
              
              <div className="relative z-10 min-h-[140px]">
                <p className="font-body text-base md:text-xl text-white/90 italic leading-relaxed mb-8">
                  {TESTIMONIALS[testimonialIndex].quote}
                </p>
                
                <footer className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="h-12 w-12 rounded-full bg-forsythia flex items-center justify-center font-display text-sm font-bold text-nocturnal-exp">
                      {TESTIMONIALS[testimonialIndex].initials}
                    </span>
                    <aside>
                      <cite className="font-display text-sm font-bold not-italic text-white block">
                        {TESTIMONIALS[testimonialIndex].author}
                      </cite>
                      <span className="font-body text-xs text-arctic-powder/60 block">
                        {TESTIMONIALS[testimonialIndex].title}
                      </span>
                    </aside>
                  </div>

                  {/* Navigation controls (strictly inline SVG inside buttons) */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handlePrevTestimonial}
                      className="h-10 w-10 flex items-center justify-center rounded-lg bg-nocturnal-exp border border-white/10 text-white hover:bg-nocturnal-exp/50 transition-hover"
                      aria-label="Previous testimonial"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTestimonial}
                      className="h-10 w-10 flex items-center justify-center rounded-lg bg-nocturnal-exp border border-white/10 text-white hover:bg-nocturnal-exp/50 transition-hover"
                      aria-label="Next testimonial"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </footer>
              </div>
            </div>

          </article>
        </section>

        {/* --- SECTION: MATRIX-DRIVEN PRICING ENGINE --- */}
        <section id="pricing" className="py-20 md:py-28 px-6 bg-oceanic-noir border-t border-white/5">
          <article className="mx-auto max-w-7xl">
            
            {/* Pricing Section Header */}
            <header className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="rounded-full bg-nocturnal-exp px-4 py-1 text-xs font-semibold uppercase tracking-wider text-forsythia">
                Flexible Scale-Locked Pricing
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white">
                Engineered for Every Operational Scale
              </h2>
              <p className="font-body text-base md:text-lg text-arctic-powder/70 max-w-xl">
                Choose the exact currency and billing cycle. Real-time updates update price elements with absolute zero interface reflow.
              </p>

              {/* SWITCHER PANEL: Billing and Currency Toggles */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 bg-nocturnal-exp/40 border border-white/5 px-6 py-4 rounded-2xl shadow-sm">
                
                {/* Billing toggle container */}
                <div className="flex items-center gap-3">
                  <span id="billing-label-monthly" className="font-body text-sm text-white font-semibold transition-hover">
                    Monthly
                  </span>
                  
                  <button
                    id="billing-toggle-btn"
                    type="button"
                    onClick={() => {
                      billingCycleRef.current = billingCycleRef.current === 'monthly' ? 'annual' : 'monthly';
                      const pill = document.getElementById('billing-toggle-pill');
                      if (pill) {
                        if (billingCycleRef.current === 'annual') {
                          pill.classList.add('translate-x-[26px]');
                        } else {
                          pill.classList.remove('translate-x-[26px]');
                        }
                      }
                      
                      const monthlyLabel = document.getElementById('billing-label-monthly');
                      const annualLabel = document.getElementById('billing-label-annual');
                      if (monthlyLabel && annualLabel) {
                        if (billingCycleRef.current === 'annual') {
                          monthlyLabel.classList.remove('font-semibold');
                          monthlyLabel.classList.add('text-white/60');
                          annualLabel.classList.add('font-semibold');
                          annualLabel.classList.remove('text-white/60');
                        } else {
                          monthlyLabel.classList.add('font-semibold');
                          monthlyLabel.classList.remove('text-white/60');
                          annualLabel.classList.remove('font-semibold');
                          annualLabel.classList.add('text-white/60');
                        }
                      }
                      performDirectDOMPriceUpdate();
                    }}
                    className="relative inline-flex h-7 w-14 items-center rounded-full bg-white/10 p-0.5 cursor-pointer transition-hover"
                  >
                    <span
                      id="billing-toggle-pill"
                      className="inline-block h-6 w-6 transform rounded-full bg-forsythia transition-toggle"
                    />
                  </button>
                  
                  <span id="billing-label-annual" className="font-body text-sm text-white/60 transition-hover flex items-center gap-1.5">
                    Annual
                    <span className="bg-forsythia text-nocturnal-exp font-display text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                      -20%
                    </span>
                  </span>
                </div>

                {/* Vertical Divider */}
                <span className="hidden sm:block h-6 w-px bg-white/10" />

                {/* Currency selector dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="currency-select" className="font-body text-sm text-arctic-powder/80">Currency:</label>
                  <select
                    id="currency-select"
                    onChange={(e) => {
                      currencyRef.current = e.target.value as 'USD' | 'INR' | 'EUR';
                      performDirectDOMPriceUpdate();
                    }}
                    className="bg-nocturnal-exp border border-white/10 text-white rounded-lg px-3 py-1.5 font-display text-sm font-medium focus:outline-none focus:ring-2 focus:ring-forsythia transition-hover"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

              </div>
            </header>

            {/* --- PRICING TIER MATRIX (3 CARDS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              
              {/* STARTER CARD */}
              <article className="rounded-3xl border border-white/5 bg-nocturnal-exp/30 p-8 flex flex-col justify-between hover:shadow-lg transition-hover">
                <div>
                  <header className="mb-6">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">Tier 01</span>
                    <h3 className="font-display text-2xl font-bold text-white">Starter</h3>
                    <p className="font-body text-sm text-arctic-powder/70 mt-1">Perfect for individual developers and small test clusters.</p>
                  </header>

                  {/* Isolated Price Section */}
                  <div className="my-6 border-y border-white/10 py-4">
                    <div className="flex items-baseline gap-2">
                      <span ref={starterPriceSpanRef} className="font-display text-4xl font-bold tracking-tight text-white">
                        {/* Populated synchronously by script */}
                      </span>
                      <span className="font-body text-sm text-white/60">/ month</span>
                    </div>
                    <span ref={starterSubtextRef} className="font-display text-[11px] font-semibold text-deep-saffron uppercase block mt-1">
                      {/* Billed yearly / monthly indicator */}
                    </span>
                  </div>

                  {/* Feature Lists */}
                  <ul className="space-y-4 mb-8 text-sm text-arctic-powder/80">
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      3 Active Data pipelines
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      1,000 events / second limits
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Standard database syncing
                    </li>
                    <li className="flex items-center gap-3 text-white/40 line-through">
                      <span className="rounded-full bg-white/5 p-1"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Autonomous AI Mapping
                    </li>
                  </ul>
                </div>

                <a href="#cta" className="w-full text-center py-3 rounded-xl bg-nocturnal-exp/80 text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-nocturnal-exp border border-white/10 transition-hover">
                  Claim Starter Pack
                </a>
              </article>

              {/* PRO CARD (FEATURED / HIGH POLISH) */}
              <article className="rounded-3xl border-2 border-forsythia bg-nocturnal-exp p-8 flex flex-col justify-between shadow-xl relative scale-100 lg:scale-[1.03]">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-forsythia px-4 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-nocturnal-exp shadow-sm">
                  Most Popular
                </span>

                <div>
                  <header className="mb-6">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-forsythia block mb-2">Tier 02</span>
                    <h3 className="font-display text-2xl font-bold text-white">Professional</h3>
                    <p className="font-body text-sm text-white/70 mt-1">Engineered for fast-growing mid-market analytics teams.</p>
                  </header>

                  {/* Isolated Price Section */}
                  <div className="my-6 border-y border-white/10 py-4">
                    <div className="flex items-baseline gap-2">
                      <span ref={proPriceSpanRef} className="font-display text-4xl font-bold tracking-tight text-forsythia">
                        {/* Populated synchronously by script */}
                      </span>
                      <span className="font-body text-sm text-white/60">/ month</span>
                    </div>
                    <span ref={proSubtextRef} className="font-display text-[11px] font-semibold text-deep-saffron uppercase block mt-1">
                      {/* Billed yearly / monthly indicator */}
                    </span>
                  </div>

                  {/* Feature Lists */}
                  <ul className="space-y-4 mb-8 text-sm text-white/80">
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/20 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Unlimited active pipelines
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/20 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      500,000 events / second
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/20 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Self-healing workflow patching
                    </li>
                    <li className="flex items-center gap-3 font-semibold text-white">
                      <span className="rounded-full bg-forsythia p-1 text-nocturnal-exp"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Autonomous AI Schema Mapping
                    </li>
                  </ul>
                </div>

                <a href="#cta" className="w-full text-center py-3.5 rounded-xl bg-forsythia text-nocturnal-exp font-display text-xs font-bold uppercase tracking-wider hover:bg-deep-saffron hover:text-white transition-hover">
                  Initiate Pro Cluster
                </a>
              </article>

              {/* SCALE CARD */}
              <article className="rounded-3xl border border-white/5 bg-nocturnal-exp/30 p-8 flex flex-col justify-between hover:shadow-lg transition-hover">
                <div>
                  <header className="mb-6">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-white/60 block mb-2">Tier 03</span>
                    <h3 className="font-display text-2xl font-bold text-white">Enterprise Scale</h3>
                    <p className="font-body text-sm text-arctic-powder/70 mt-1">Complete autonomy with dedicated infrastructure routing.</p>
                  </header>

                  {/* Isolated Price Section */}
                  <div className="my-6 border-y border-white/10 py-4">
                    <div className="flex items-baseline gap-2">
                      <span ref={scalePriceSpanRef} className="font-display text-4xl font-bold tracking-tight text-white">
                        {/* Populated synchronously by script */}
                      </span>
                      <span className="font-body text-sm text-white/60">/ month</span>
                    </div>
                    <span ref={scaleSubtextRef} className="font-display text-[11px] font-semibold text-deep-saffron uppercase block mt-1">
                      {/* Billed yearly / monthly indicator */}
                    </span>
                  </div>

                  {/* Feature Lists */}
                  <ul className="space-y-4 mb-8 text-sm text-arctic-powder/80">
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Dedicated physical clusters
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      10M+ events / second limit
                    </li>
                    <li className="flex items-center gap-3 font-semibold text-white">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Enterprise SLA & Uptime Guarantee
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="rounded-full bg-forsythia/10 p-1 text-forsythia"><CheckIcon className="w-3.5 h-3.5" /></span>
                      Custom security encryption keys
                    </li>
                  </ul>
                </div>

                <a href="#cta" className="w-full text-center py-3 rounded-xl bg-nocturnal-exp/80 text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-nocturnal-exp border border-white/10 transition-hover">
                  Schedule Enterprise Call
                </a>
              </article>

            </div>

          </article>
        </section>

        {/* --- SECTION: FINAL CONVERSION CTA --- */}
        <section id="cta" className="relative py-20 md:py-28 px-6 bg-gradient-to-br from-nocturnal-exp to-oceanic-noir text-white overflow-hidden">
          {/* Subtle background nodes */}
          <span className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-forsythia/5 rounded-full blur-3xl pointer-events-none" />
          <span className="absolute bottom-12 right-1/4 w-80 h-80 bg-deep-saffron/5 rounded-full blur-3xl pointer-events-none" />

          <article className="mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center gap-8">
            <span className="rounded-full bg-white/10 border border-white/20 px-4 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-forsythia">
              Ready to Accelerate
            </span>
            
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
              Claim Your Free 14-Day Automation Trial
            </h2>
            
            <p className="font-body text-base md:text-lg text-white/80 max-w-xl">
              Spin up persistent API tunnels, test real-time bento alignment, and experience seamless multi-currency scaling today. No card required.
            </p>

            {/* Newsletter conversion panel (Strictly isolated styling) */}
            <form onSubmit={handleSubscribeSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Enter your work email..."
                className="flex-1 bg-white/5 border border-white/15 focus:border-forsythia rounded-xl px-5 py-3.5 text-sm font-body text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-forsythia transition-hover"
              />
              <button
                type="submit"
                className="rounded-xl bg-forsythia px-6 py-3.5 font-display text-sm font-bold text-nocturnal-exp uppercase tracking-wider hover:bg-deep-saffron hover:text-white transition-hover shadow-md cursor-pointer"
              >
                Access Platform
              </button>
            </form>

            {subscribedStatus && (
              <p className="font-display text-xs text-forsythia animate-fade-in font-semibold">
                ✓ Check your inbox! Your autonomous AetherFlux trial invitation is en route.
              </p>
            )}

            <div className="flex justify-center items-center gap-6 mt-6 opacity-60 text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldIcon className="w-4 h-4 text-forsythia" /> Security Certified
              </span>
              <span className="h-4 w-px bg-white/20" />
              <span className="flex items-center gap-1.5">
                <ZapIcon className="w-4 h-4 text-forsythia" /> Zero Downtime Setup
              </span>
            </div>

          </article>
        </section>

      </main>

      {/* --- FOOTER (SEMANTIC & COMPACTED) --- */}
      <footer className="bg-oceanic-noir text-white/60 py-16 px-6 border-t border-white/5">
        <article className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <aside className="col-span-2 md:col-span-1 flex flex-col items-start gap-4">
            <span className="font-display text-lg font-bold text-white flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6 text-forsythia">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              AetherFlux
            </span>
            <p className="font-body text-xs text-white/50 leading-relaxed">
              Consolidate data pipelines, streamline microservices, and deploy predictive ML nodes seamlessly across global server networks.
            </p>
          </aside>

          <aside className="flex flex-col gap-3">
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Product</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-forsythia transition-hover">Real-Time Sync</a></li>
              <li><a href="#features" className="hover:text-forsythia transition-hover">ML Projections</a></li>
              <li><a href="#features" className="hover:text-forsythia transition-hover">Self-Patching DBs</a></li>
              <li><a href="#pricing" className="hover:text-forsythia transition-hover">Custom Multi-Pricing</a></li>
            </ul>
          </aside>

          <aside className="flex flex-col gap-3">
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Resources</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-forsythia transition-hover">Developer Docs</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">API Reference</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">Pipeline Status</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">Enterprise Support</a></li>
            </ul>
          </aside>

          <aside className="flex flex-col gap-3">
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Company</span>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-forsythia transition-hover">About AetherFlux</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">Brand Identity</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">Privacy Blueprint</a></li>
              <li><a href="#" className="hover:text-forsythia transition-hover">Security Standard</a></li>
            </ul>
          </aside>

        </article>

        <article className="mx-auto max-w-7xl border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} AetherFlux, Inc. All rights reserved. Built for Next-Gen Scale.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-forsythia transition-hover">Terms of Agreement</a>
            <a href="#" className="hover:text-forsythia transition-hover">Privacy Shield</a>
          </div>
        </article>
      </footer>

    </div>
  );
}
