/**
 * Subnet Master - Application Entry Point & Controller
 * Manages view routing, internationalization, sound toggle, and UI reactivity.
 */

function initApp() {
  try {
    // Initialize UI translations
    applyTranslations();
  } catch (err) {
    console.error('applyTranslations error:', err);
  }

  try {
    // Initialize Subnet Calculator
    SubnetCalculator.init();
  } catch (err) {
    console.error('SubnetCalculator init error:', err);
  }

  try {
    // Initialize Game Modes
    if (window.SubnetGames) {
      SubnetGames.initSubnetSlicer();
      SubnetGames.initBinaryMatrix();
      SubnetGames.initQuizArena();
      SubnetGames.updateStatsUI();
    }
  } catch (err) {
    console.error('SubnetGames init error:', err);
  }



  try {
    // Initialize Smart Kurd Plus Theme Engine
    if (window.SKPlusTheme) {
      SKPlusTheme.init();
    }
  } catch (err) {
    console.error('SKPlusTheme init error:', err);
  }

  // Navigation Tabs (Main Top Navigation)
  // Global view switching function for Header, Hero, and Footer
  window.switchNavTab = function(targetViewId, gameMode) {
    if (window.SoundFX) SoundFX.click();
    const navTabs = document.querySelectorAll('.nav-link[data-view], .nav-tab-btn');
    const viewSections = document.querySelectorAll('.app-view');

    navTabs.forEach(t => {
      if (t.dataset.view === targetViewId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    viewSections.forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
      targetView.classList.add('active');
      targetView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (gameMode && targetViewId === 'viewGames') {
      const targetBtn = document.querySelector(`.game-submode-btn[data-mode="${gameMode}"]`);
      if (targetBtn) targetBtn.click();
    }
  };

  // Navigation Tabs (Main Top Navigation)
  const navTabs = document.querySelectorAll('.nav-link[data-view], .nav-tab-btn');
  const viewSections = document.querySelectorAll('.app-view');

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = tab.dataset.view;
      window.switchNavTab(targetViewId);
    });
  });

  // Hero & Footer Navigation Buttons
  document.querySelectorAll('.hero-nav-btn, .footer-nav-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = btn.dataset.target || btn.getAttribute('href')?.replace('#', '');
      const gameMode = btn.dataset.gameMode;
      if (targetViewId) {
        window.switchNavTab(targetViewId, gameMode);
      }
    });
  });

  // Game Mode Tabs inside Game Section
  const gameModeBtns = document.querySelectorAll('.game-submode-btn');
  const gamePanels = document.querySelectorAll('.game-panel');

  gameModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.SoundFX) SoundFX.click();
      const mode = btn.dataset.mode;

      gameModeBtns.forEach(b => b.classList.remove('active'));
      gamePanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel_${mode}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (window.SubnetGames) {
        if (mode === 'slicer') SubnetGames.initSubnetSlicer();
        if (mode === 'binary') SubnetGames.newBinaryChallenge();
        if (mode === 'quiz') SubnetGames.initQuizArena();
      }
    });
  });

  // Global Language Change Listener
  window.addEventListener('languageChanged', (e) => {
    applyTranslations();
    if (window.SubnetGames) {
      if (SubnetGames.initDetectiveGame) SubnetGames.initDetectiveGame();
      if (SubnetGames.initBinaryMatrix) SubnetGames.initBinaryMatrix();
      if (SubnetGames.initQuizArena) SubnetGames.initQuizArena();
      if (SubnetGames.updateStatsUI) SubnetGames.updateStatsUI();
    }
    if (window.SubnetCalculator) SubnetCalculator.performCalculation();
  });

  // Audio Mute/Unmute Toggle
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (!window.SoundFX) return;
      const isMuted = SoundFX.toggleMute();
      updateSoundToggleUI(isMuted);
      if (!isMuted) SoundFX.click();
    });
  }

  // Button Bindings for Games
  bindGameButtons();
}

function updateSoundToggleUI(isMuted) {
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (!soundToggleBtn) return;
  if (typeof isMuted === 'undefined' && window.SoundFX) {
    isMuted = SoundFX.getIsMuted();
  }
  const label = isMuted ? t('soundOff') : t('soundOn');
  soundToggleBtn.setAttribute('title', label);
  soundToggleBtn.setAttribute('aria-label', label);
  soundToggleBtn.innerHTML = isMuted 
    ? `<i class="fa-solid fa-volume-xmark" style="color: var(--accent-rose);"></i>`
    : `<i class="fa-solid fa-volume-high" style="color: var(--accent-cyan);"></i>`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function applyTranslations() {
  const lang = getCurrentLang();

  // Update document title
  const docTitle = document.getElementById('docTitle');
  if (docTitle) {
    docTitle.textContent = t('appTitle');
  } else {
    document.title = t('appTitle');
  }

  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const val = t(key);
      if (val.includes('<') && val.includes('>')) {
        el.innerHTML = val;
      } else {
        const icon = el.querySelector('i');
        const innerSpan = el.querySelector('span');
        if (icon && innerSpan) {
          innerSpan.textContent = val;
        } else if (icon) {
          el.innerHTML = '';
          el.appendChild(icon);
          el.appendChild(document.createTextNode(' ' + val));
        } else {
          el.textContent = val;
        }
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });

  // Update directional arrow icons (RTL points left, LTR points right)
  document.querySelectorAll('.read-more i, .btn-more-arrow i, .btn-arrow i').forEach(icon => {
    icon.className = lang === 'ku' ? 'fa-solid fa-arrow-left' : 'fa-solid fa-arrow-right';
  });

  // Sync active language card in settings drawer
  document.querySelectorAll('.lang-card').forEach(card => {
    const cardLang = card.getAttribute('data-lang');
    const isTarget = (lang === 'ku' && cardLang === 'ckb') || (lang === 'en' && cardLang === 'en');
    card.classList.toggle('active', isTarget);
  });

  // Update sound toggle button icon & tooltip
  updateSoundToggleUI();
}

function bindGameButtons() {
  // IP Detective & Troubleshooter buttons
  const slicerVerifyBtn = document.getElementById('slicerVerifyBtn');
  if (slicerVerifyBtn) {
    slicerVerifyBtn.addEventListener('click', SubnetGames.handleVerifySlicer);
  }

  const slicerNextBtn = document.getElementById('slicerNextLvlBtn');
  if (slicerNextBtn) {
    slicerNextBtn.addEventListener('click', SubnetGames.handleNextSlicerLevel);
  }

  const slicerResetBtn = document.getElementById('slicerResetBtn');
  if (slicerResetBtn) {
    slicerResetBtn.addEventListener('click', SubnetGames.handleResetSlicer);
  }

  const detectiveRandomBtn = document.getElementById('detectiveRandomBtn');
  if (detectiveRandomBtn) {
    detectiveRandomBtn.addEventListener('click', () => {
      if (window.SubnetGames) SubnetGames.handleRandomDetectiveCase();
    });
  }

  // Speed game buttons
  const speedStartBtn = document.getElementById('speedStartBtn');
  if (speedStartBtn) {
    speedStartBtn.addEventListener('click', SubnetGames.startSpeedGame);
  }

  const speedPassBtn = document.getElementById('speedPassBtn');
  if (speedPassBtn) {
    speedPassBtn.addEventListener('click', SubnetGames.handleSpeedPass);
  }

  const speedRestartBtn = document.getElementById('speedRestartBtn');
  if (speedRestartBtn) {
    speedRestartBtn.addEventListener('click', SubnetGames.startSpeedGame);
  }

  // Binary matrix button
  const binaryCheckBtn = document.getElementById('binaryCheckBtn');
  if (binaryCheckBtn) {
    binaryCheckBtn.addEventListener('click', SubnetGames.handleCheckBinary);
  }

  const binaryNextBtn = document.getElementById('binaryNextBtn');
  if (binaryNextBtn) {
    binaryNextBtn.addEventListener('click', () => {
      SoundFX.click();
      SubnetGames.newBinaryChallenge();
    });
  }

  // Quiz next button
  const quizNextBtn = document.getElementById('quizNextBtn');
  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', SubnetGames.handleNextQuizQuestion);
  }
}
