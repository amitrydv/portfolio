import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { getPortfolioData, PortfolioData, defaultData } from '../lib/firebase';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  
  type ThemeKey = 'dark' | 'light' | 'neon' | 'ocean' | 'forest' | 'crimson' | 'sepia';
  const [theme, setTheme] = useState<ThemeKey>('dark');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Localized Smooth Parallax for Portrait Card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const imgX = useTransform(springX, [-1, 1], [-15, 15]);
  const imgY = useTransform(springY, [-1, 1], [-15, 15]);
  const rotateX = useTransform(springY, [-1, 1], [6, -6]);
  const rotateY = useTransform(springX, [-1, 1], [-6, 6]);

  // Subtle Glare Effect
  const glareX = useTransform(springX, [-1, 1], ['-50%', '150%']);
  const glareY = useTransform(springY, [-1, 1], ['-50%', '150%']);
  const glareOpacity = useTransform(springX, [-1, 0, 1], [0.3, 0, 0.3]);

  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to 1
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to 1
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePortraitMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    getPortfolioData().then(fetched => {
      setData(fetched);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navItems = [
    { id: 'story', default: 'Story', clicked: data.storyText },
    { id: 'projects', default: 'Projects', clicked: data.projectsText || "Coming soon." },
    { id: 'jobs', default: 'Jobs', clicked: data.jobsText },
    { id: 'whatsapp', default: 'WhatsApp', clicked: data.whatsappUsername, link: `https://wa.me/${data.whatsappUsername.replace('@', '')}` },
  ];

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.link) {
      // open link
      return;
    }
    e.preventDefault();
    setActiveNavItem(item.id);
  };

  if (loading) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0a0a] text-cream">Loading...</div>;
  }

  const themeConfig: Record<ThemeKey, any> = {
    dark: {
      bg: 'bg-[#050505]',
      textPrimary: 'text-white',
      textMuted: 'text-white/50',
      panelBg: 'bg-[#0a0a0a]/90',
      borderColor: 'border-white/[0.06]',
      buttonBg: 'bg-white/[0.03] hover:bg-white/[0.08]',
      overlay: 'from-[#050505]/80 via-[#050505]/60 to-[#050505]/95',
      radial: 'from-transparent via-[#050505]/60 to-[#050505]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
      selection: 'selection:bg-[#333]'
    },
    light: {
      bg: 'bg-[#f5f5f5]',
      textPrimary: 'text-black',
      textMuted: 'text-black/50',
      panelBg: 'bg-white/70',
      borderColor: 'border-black/[0.05]',
      buttonBg: 'bg-black/[0.03] hover:bg-black/[0.08]',
      overlay: 'from-[#f5f5f5]/80 via-[#f5f5f5]/60 to-[#f5f5f5]/95',
      radial: 'from-transparent via-[#f5f5f5]/60 to-[#f5f5f5]',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.05)]',
      selection: 'selection:bg-black/10'
    },
    neon: {
      bg: 'bg-[#060014]',
      textPrimary: 'text-fuchsia-100',
      textMuted: 'text-fuchsia-300/50',
      panelBg: 'bg-[#090022]/80',
      borderColor: 'border-fuchsia-500/20',
      buttonBg: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20',
      overlay: 'from-[#060014]/80 via-[#180026]/60 to-[#060014]/95',
      radial: 'from-transparent via-[#060014]/60 to-[#060014]',
      shadow: 'shadow-[0_20px_50px_rgba(217,70,239,0.15)]',
      selection: 'selection:bg-fuchsia-500/30'
    },
    ocean: {
      bg: 'bg-[#000a12]',
      textPrimary: 'text-cyan-50',
      textMuted: 'text-cyan-200/50',
      panelBg: 'bg-[#001424]/80',
      borderColor: 'border-cyan-500/20',
      buttonBg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      overlay: 'from-[#000a12]/80 via-[#001a33]/60 to-[#000a12]/95',
      radial: 'from-transparent via-[#000a12]/60 to-[#000a12]',
      shadow: 'shadow-[0_20px_50px_rgba(6,182,212,0.15)]',
      selection: 'selection:bg-cyan-500/30'
    },
    forest: {
      bg: 'bg-[#010a05]',
      textPrimary: 'text-emerald-50',
      textMuted: 'text-emerald-200/50',
      panelBg: 'bg-[#02170b]/80',
      borderColor: 'border-emerald-500/20',
      buttonBg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      overlay: 'from-[#010a05]/80 via-[#032612]/60 to-[#010a05]/95',
      radial: 'from-transparent via-[#010a05]/60 to-[#010a05]',
      shadow: 'shadow-[0_20px_50px_rgba(16,185,129,0.15)]',
      selection: 'selection:bg-emerald-500/30'
    },
    crimson: {
      bg: 'bg-[#120000]',
      textPrimary: 'text-rose-50',
      textMuted: 'text-rose-200/50',
      panelBg: 'bg-[#240000]/80',
      borderColor: 'border-rose-500/20',
      buttonBg: 'bg-rose-500/10 hover:bg-rose-500/20',
      overlay: 'from-[#120000]/80 via-[#330000]/60 to-[#120000]/95',
      radial: 'from-transparent via-[#120000]/60 to-[#120000]',
      shadow: 'shadow-[0_20px_50px_rgba(225,29,72,0.15)]',
      selection: 'selection:bg-rose-500/30'
    },
    sepia: {
      bg: 'bg-[#e8ddc5]',
      textPrimary: 'text-[#4a3f35]',
      textMuted: 'text-[#4a3f35]/60',
      panelBg: 'bg-[#f4ecd8]/70',
      borderColor: 'border-[#4a3f35]/10',
      buttonBg: 'bg-[#4a3f35]/5 hover:bg-[#4a3f35]/10',
      overlay: 'from-[#e8ddc5]/80 via-[#f4ecd8]/60 to-[#e8ddc5]/95',
      radial: 'from-transparent via-[#e8ddc5]/60 to-[#e8ddc5]',
      shadow: 'shadow-[0_20px_50px_rgba(74,63,53,0.08)]',
      selection: 'selection:bg-[#4a3f35]/20'
    }
  };

  const themeNames: Record<ThemeKey, string> = {
    dark: 'Midnight',
    light: 'Alabaster',
    neon: 'Cyber',
    ocean: 'Abyss',
    forest: 'Viridian',
    crimson: 'Inferno',
    sepia: 'Parchment'
  };

  const themeColors: Record<ThemeKey, string> = {
    dark: '#050505',
    light: '#f5f5f5',
    neon: '#d946ef',
    ocean: '#06b6d4',
    forest: '#10b981',
    crimson: '#e11d48',
    sepia: '#e8ddc5'
  };

  const currentTheme = themeConfig[theme];

  // Smooth Staggered Load Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className={`relative h-[100dvh] w-full overflow-hidden transition-colors duration-1000 ${currentTheme.bg} ${currentTheme.textPrimary} font-hn ${currentTheme.selection}`}>
      
      {/* Background Image (Editorial Style) */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        animate={{ scale: [1.02, 1.05, 1.02] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={data.backgroundUrl}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover opacity-30 grayscale saturate-50"
        />
        {/* Sleek vignette overlay */}
        <div className={`absolute inset-0 bg-gradient-to-b ${currentTheme.overlay} mix-blend-multiply transition-colors duration-1000`} />
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${currentTheme.radial} pointer-events-none transition-colors duration-1000`} />
      </motion.div>

      {/* Layer: Main Content Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="absolute inset-4 sm:inset-8 z-20 flex flex-col md:flex-row gap-4 sm:gap-6 pointer-events-none"
      >
        
        {/* Left: Portrait Card */}
        <motion.div 
          variants={itemVariants}
          className={`relative w-full md:w-1/3 h-[50vh] md:h-full rounded-2xl overflow-hidden border transition-colors duration-1000 ${currentTheme.borderColor} ${currentTheme.panelBg} ${currentTheme.shadow} pointer-events-auto cursor-crosshair`}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handlePortraitMouseMove}
          onMouseLeave={handlePortraitMouseLeave}
        >
          <motion.div 
            className="absolute inset-0 z-0 origin-center"
            style={{ x: imgX, y: imgY, scale: 1.1 }}
          >
            <img
              src={data.portraitUrl}
              alt="Portrait"
              className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[0.4] hover:grayscale-0 hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </motion.div>
          {/* Light Glare */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_50%)]"
            style={{ left: glareX, top: glareY, opacity: glareOpacity }}
          />
          {/* Subtle gradient overlay on portrait */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-current/50 via-current/10 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-10 left-10 right-10 text-left pointer-events-none z-30">
             <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 mix-blend-overlay">AMIT YADAV</h1>
             <p className={`${currentTheme.textMuted} font-medium tracking-[0.2em] text-xs uppercase mix-blend-overlay transition-colors duration-1000`}>Creative Developer</p>
          </div>
        </motion.div>

        {/* Right: Info & Navigation Card */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 md:h-full pointer-events-auto">
          
          {/* Header Bar */}
          <motion.div 
            variants={itemVariants}
            className={`relative z-50 flex items-center justify-between p-6 sm:px-10 sm:py-8 rounded-2xl border transition-colors duration-1000 ${currentTheme.borderColor} ${currentTheme.panelBg} backdrop-blur-xl ${currentTheme.shadow}`}
          >
            <Link to="/admin" className={`font-syne text-sm tracking-[0.3em] uppercase ${currentTheme.textPrimary} transition-colors duration-1000`} style={{ cursor: 'default' }}>
              AMIT YADAV
            </Link>
            
            <div className="flex items-center gap-4 flex-wrap">
              
              <div className="relative z-50">
                <button 
                  title="Themes"
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className={`p-3 rounded-full ${currentTheme.buttonBg} border ${currentTheme.borderColor} transition-all ${themeMenuOpen ? '' : 'hover:-translate-y-1'} flex items-center justify-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>
                
                {themeMenuOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
                )}

                <AnimatePresence>
                  {themeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full right-0 mt-2 p-2 rounded-2xl border ${currentTheme.borderColor} ${currentTheme.panelBg} backdrop-blur-xl shadow-2xl flex flex-col gap-1 min-w-[140px] z-50`}
                    >
                      {(Object.keys(themeConfig) as ThemeKey[]).map(t => (
                        <button
                          key={t}
                          onClick={() => {
                            setTheme(t);
                            setThemeMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${theme === t ? `${currentTheme.textPrimary} bg-black/10 dark:bg-white/10` : `${currentTheme.textMuted} hover:${currentTheme.textPrimary} hover:bg-black/5 dark:hover:bg-white/5`}`}
                        >
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: themeColors[t] }} />
                          {themeNames[t]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {data.customLinks?.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.title} className={`p-3 rounded-full ${currentTheme.buttonBg} border ${currentTheme.borderColor} transition-all hover:-translate-y-1 flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </a>
              ))}

              <a href={data.instagramLink} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full ${currentTheme.buttonBg} border ${currentTheme.borderColor} transition-all hover:-translate-y-1 flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href={data.linkedinLink} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full ${currentTheme.buttonBg} border ${currentTheme.borderColor} transition-all hover:-translate-y-1 flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <button 
                className={`md:hidden p-3 rounded-full ${currentTheme.buttonBg} border ${currentTheme.borderColor} transition-all`}
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <div className="w-4 h-3.5 flex flex-col justify-between">
                  <span className="w-full h-[1.5px] bg-current rounded-full"></span>
                  <span className="w-full h-[1.5px] bg-current rounded-full"></span>
                  <span className="w-full h-[1.5px] bg-current rounded-full"></span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Dynamic Content Area (Desktop) */}
          <motion.div 
            variants={itemVariants}
            className={`hidden md:flex flex-1 p-12 rounded-2xl border transition-colors duration-1000 ${currentTheme.borderColor} ${currentTheme.panelBg} backdrop-blur-xl ${currentTheme.shadow} flex-col justify-center relative overflow-hidden`}
          >
             
             {/* Navigation Sidebar */}
             <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10 text-right">
                {navItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={item.link || "#"}
                    target={item.link ? "_blank" : undefined}
                    rel={item.link ? "noopener noreferrer" : undefined}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`font-syne text-4xl lg:text-6xl tracking-tight transition-all duration-700 flex items-center justify-end gap-6 ${activeNavItem === item.id ? `${currentTheme.textPrimary} translate-x-0 font-normal scale-105 origin-right` : `${currentTheme.textMuted} hover:${currentTheme.textPrimary} -translate-x-4 font-light scale-100 origin-right`}`}
                  >
                    {activeNavItem === item.id && <span className={`text-sm tracking-[0.2em] font-medium uppercase ${currentTheme.textMuted} hidden lg:block`}>&mdash;</span>}
                    {item.default}
                  </a>
                ))}
             </div>

             {/* Content Display */}
             <div className="w-2/3 h-full flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNavItem || 'default'}
                    initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(8px)', scale: 0.98 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-2xl lg:text-3xl font-light leading-normal tracking-wide ${currentTheme.textPrimary} transition-colors duration-1000`}
                  >
                    {activeNavItem ? navItems.find(i => i.id === activeNavItem)?.clicked : <span className={`${currentTheme.textMuted} font-syne text-3xl lg:text-5xl tracking-tight transition-colors duration-1000`}>Explore.</span>}
                  </motion.div>
                </AnimatePresence>
             </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Layer: Mobile drawer (z-40) */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-500 md:hidden ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm ${currentTheme.bg} border-l ${currentTheme.borderColor} px-8 py-10 transition-transform duration-600 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden shadow-[-10px_0_30px_rgba(0,0,0,0.8)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className={`absolute top-8 right-8 p-2 ${currentTheme.textMuted} hover:${currentTheme.textPrimary}`}
          onClick={() => setDrawerOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="mt-20 flex flex-col gap-12">
          <div>
            <div className={`${currentTheme.textMuted} uppercase tracking-[0.2em] text-xs font-syne transition-all duration-500 ${
              drawerOpen ? 'opacity-100 translate-y-0 delay-[250ms]' : 'opacity-0 translate-y-4'
            }`}>
              Explore
            </div>
            <div className="mt-6 flex flex-col gap-6">
              {navItems.map((item, i) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <a
                    href={item.link || "#"}
                    target={item.link ? "_blank" : undefined}
                    onClick={(e) => {
                      if (!item.link) {
                        e.preventDefault();
                        setActiveNavItem(activeNavItem === item.id ? null : item.id);
                      }
                    }}
                    className={`${currentTheme.textPrimary} text-4xl font-syne font-bold transition-all duration-500 ${
                      drawerOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: drawerOpen ? `${300 + i * 80}ms` : '0ms' }}
                  >
                    {item.default}
                  </a>
                  {activeNavItem === item.id && !item.link && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`${currentTheme.textMuted} text-sm mt-2`}
                    >
                      {item.clicked}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Subtle Film Grain Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} 
      />
    </div>
  );
}
