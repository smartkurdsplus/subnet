/**
 * Smart Kurds Plus - Theme Engine & Customization System
 * Interactive Canvas Parallax, Settings Drawer, Font/Theme/Accent Color Switcher.
 * 100% compliant with Smart Kurds Plus standards.
 */

const SKPlusTheme = (() => {
  // Preset Font Stacks
  const fontDefinitions = {
    'noto-kufi': "'Noto Kufi Arabic', sans-serif",
    'vazirmatn': "'Vazirmatn', -apple-system, sans-serif",
    'noto-sans': "'Noto Sans Arabic', sans-serif",
    'inter': "'Inter', -apple-system, sans-serif",
    'outfit': "'Outfit', sans-serif",
    'jakarta': "'Plus Jakarta Sans', sans-serif"
  };

  const fontNames = {
    'noto-kufi': 'نۆتۆ کوفی (Noto Kufi)',
    'vazirmatn': 'ڤەزیرمەتن (Vazirmatn)',
    'noto-sans': 'نۆتۆ سانز (Noto Sans)',
    'inter': 'Inter',
    'outfit': 'Outfit',
    'jakarta': 'Plus Jakarta Sans'
  };

  let currentTheme = localStorage.getItem('skplus_theme') || 'dark';
  let currentFont = localStorage.getItem('skplus_font') || 'noto-kufi';
  let currentFontSize = localStorage.getItem('skplus_font_size') || '100%';
  let currentAccentColor = localStorage.getItem('skplus_accent') || '#3a86ff';

  // Canvas Parallax Background System
  let canvas = null;
  let ctx = null;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, radius: 200 };
  let mouseOffset = { x: 0, y: 0 };
  let targetOffset = { x: 0, y: 0 };
  let skElements = [];
  const skCount = 45;
  let animationFrameId = null;

  function init() {
    applyStoredSettings();
    initSettingsDrawer();
    initCanvas();
    startCanvasLoop();
  }

  function applyStoredSettings() {
    // Theme
    setTheme(currentTheme, true);
    // Font
    setFont(currentFont, true);
    // Font Size
    setFontSize(currentFontSize, true);
    // Accent Color
    setAccentColor(currentAccentColor, true);
  }

  /* ----------------------------------------------------
     Settings Drawer Controls
     ---------------------------------------------------- */
  function initSettingsDrawer() {
    const drawer = document.getElementById('settingsDrawer');
    const overlay = document.getElementById('settingsOverlay');
    const closeBtn = document.getElementById('settingsCloseBtn');
    const toggleNav = document.getElementById('settingsToggleNav');
    const floatingBtn = document.getElementById('floatingSettingsBtn');

    function openDrawer() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      if (window.SoundFX) SoundFX.click();
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      if (window.SoundFX) SoundFX.click();
    }

    if (toggleNav) toggleNav.addEventListener('click', openDrawer);
    if (floatingBtn) floatingBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Language cards inside drawer
    document.querySelectorAll('.lang-card').forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        if (typeof window.setLanguage === 'function') {
          window.setLanguage(lang === 'ckb' ? 'ku' : 'en');
        }
        document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (window.SoundFX) SoundFX.click();
      });
    });

    // Font cards
    document.querySelectorAll('.font-card').forEach(card => {
      card.addEventListener('click', () => {
        const fontKey = card.getAttribute('data-font');
        setFont(fontKey);
        if (window.SoundFX) SoundFX.click();
      });
    });

    // Font size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        setFontSize(size);
        if (window.SoundFX) SoundFX.click();
      });
    });

    // Accent color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.getAttribute('data-color');
        setAccentColor(color);
        if (window.SoundFX) SoundFX.click();
      });
    });

    // Theme preset cards
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const theme = card.getAttribute('data-theme');
        setTheme(theme);
        if (window.SoundFX) SoundFX.click();
      });
    });

    // Reset settings button
    const resetBtn = document.getElementById('btnResetSettings');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem('skplus_theme');
        localStorage.removeItem('skplus_font');
        localStorage.removeItem('skplus_font_size');
        localStorage.removeItem('skplus_accent');

        setTheme('dark');
        setFont('noto-kufi');
        setFontSize('100%');
        setAccentColor('#3a86ff');
        if (typeof window.setLanguage === 'function') {
          window.setLanguage('ku');
        }
        if (window.SoundFX) SoundFX.click();
      });
    }
  }

  function setTheme(theme, silent = false) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-theme') === theme);
    });
    localStorage.setItem('skplus_theme', theme);
  }

  function setFont(fontKey, silent = false) {
    if (!fontDefinitions[fontKey]) return;
    currentFont = fontKey;
    const fontVal = fontDefinitions[fontKey];
    document.documentElement.style.setProperty('--active-font', fontVal);
    document.body.style.fontFamily = fontVal;

    document.querySelectorAll('.font-card').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-font') === fontKey);
    });
    localStorage.setItem('skplus_font', fontKey);
  }

  function setFontSize(size, silent = false) {
    currentFontSize = size;
    document.documentElement.style.setProperty('--base-font-size', size);
    document.querySelectorAll('.size-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-size') === size);
    });
    localStorage.setItem('skplus_font_size', size);
  }

  function setAccentColor(colorHex, silent = false) {
    currentAccentColor = colorHex;
    document.documentElement.style.setProperty('--accent-cyan', colorHex);
    document.documentElement.style.setProperty('--border-glow', `${colorHex}45`);
    document.documentElement.style.setProperty('--shadow-glow', `0 0 25px ${colorHex}35`);

    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.getAttribute('data-color') === colorHex);
    });
    localStorage.setItem('skplus_accent', colorHex);
    refreshCanvasColors();
  }

  /* ----------------------------------------------------
     Canvas Parallax System (Smart Kurds Plus Signature)
     ---------------------------------------------------- */
  function getSymbols() {
    return ['S', 'K', '+'];
  }

  function initCanvas() {
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    const symbols = getSymbols();
    skElements = [];
    for (let i = 0; i < skCount; i++) {
      skElements.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 18 + 16,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: Math.random() > 0.4 ? (currentAccentColor || '#3a86ff') : (Math.random() > 0.5 ? '#00f5d4' : '#ffb703'),
        alpha: Math.random() * 0.55 + 0.35,
        parallaxFactor: Math.random() * 0.08 + 0.02
      });
    }
  }

  function refreshCanvasColors() {
    if (!skElements || !skElements.length) return;
    skElements.forEach(item => {
      item.color = Math.random() > 0.4 ? (currentAccentColor || '#3a86ff') : (Math.random() > 0.5 ? '#00f5d4' : '#ffb703');
    });
  }

  function getAccentRGB() {
    const hex = (currentAccentColor || '#3a86ff').replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 245;
    const b = parseInt(hex.substring(4, 6), 16) || 212;
    return `${r}, ${g}, ${b}`;
  }

  function renderSKPlusParallax() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, width, height);

    const rgb = getAccentRGB();

    // 1. Grid Lines
    ctx.strokeStyle = `rgba(${rgb}, 0.06)`;
    ctx.lineWidth = 1;
    const gridSize = 60;
    
    const shiftX = mouseOffset.x % gridSize;
    const shiftY = mouseOffset.y % gridSize;

    for (let x = shiftX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = shiftY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Connection Filaments (Wires linking close S, K, + glyphs)
    for (let i = 0; i < skElements.length; i++) {
      for (let j = i + 1; j < skElements.length; j++) {
        const dx = skElements[i].x - skElements[j].x;
        const dy = skElements[i].y - skElements[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rgb}, ${0.22 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(skElements[i].x + mouseOffset.x * skElements[i].parallaxFactor, skElements[i].y + mouseOffset.y * skElements[i].parallaxFactor);
          ctx.lineTo(skElements[j].x + mouseOffset.x * skElements[j].parallaxFactor, skElements[j].y + mouseOffset.y * skElements[j].parallaxFactor);
          ctx.stroke();
        }
      }
    }

    // 3. Floating Glyphs (S, K, +)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    skElements.forEach(item => {
      const drawX = item.x + mouseOffset.x * item.parallaxFactor * 1.5;
      const drawY = item.y + mouseOffset.y * item.parallaxFactor * 1.5;

      ctx.font = `800 ${item.size}px 'Vazirmatn', 'Noto Kufi Arabic', 'Inter', sans-serif`;
      ctx.fillStyle = item.color;
      ctx.globalAlpha = item.alpha;
      ctx.shadowBlur = 14;
      ctx.shadowColor = item.color;
      ctx.fillText(item.symbol, drawX, drawY);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      item.x += item.vx;
      item.y += item.vy;

      if (item.x < 0 || item.x > width) item.vx *= -1;
      if (item.y < 0 || item.y > height) item.vy *= -1;

      // Mouse repulsion physics
      if (mouse.x && mouse.y) {
        const mdx = mouse.x - drawX;
        const mdy = mouse.y - drawY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          const force = (mouse.radius - mdist) / mouse.radius;
          item.x -= (mdx / mdist) * force * 4;
          item.y -= (mdy / mdist) * force * 4;
        }
      }
    });
  }

  function animateCanvas() {
    if (!ctx) return;
    mouseOffset.x += (targetOffset.x - mouseOffset.x) * 0.08;
    mouseOffset.y += (targetOffset.y - mouseOffset.y) * 0.08;

    renderSKPlusParallax();
    animationFrameId = requestAnimationFrame(animateCanvas);
  }

  function startCanvasLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animateCanvas();
  }

  window.addEventListener('resize', initCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    targetOffset.x = (e.clientX - width / 2) * 0.05;
    targetOffset.y = (e.clientY - height / 2) * 0.05;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      targetOffset.x = (e.touches[0].clientX - width / 2) * 0.05;
      targetOffset.y = (e.touches[0].clientY - height / 2) * 0.05;
    }
  }, { passive: true });

  return {
    init,
    setTheme,
    setFont,
    setFontSize,
    setAccentColor
  };
})();

if (typeof window !== 'undefined') {
  window.SKPlusTheme = SKPlusTheme;
}
