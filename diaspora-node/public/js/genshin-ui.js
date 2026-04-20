/**
 * Genshin-Style UI Enhancements
 * Handles: Loading screen, mobile detection, language routing, video hero
 */

class GenshinUI {
  constructor() {
    this.config = {
      loaderDuration: 3000,
      fadeOutDuration: 800,
      supportedLanguages: ['en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'pt', 'ru', 'id'],
      defaultLanguage: 'en',
    };

    this.init();
  }

  /**
   * Initialize all features
   */
  init() {
    this.setupLoadingScreen();
    this.setupMobileDetection();
    this.setupLanguageRouting();
    this.setupVideoHero();
    this.setupScrollEffects();
  }

  /**
   * ========== LOADING SCREEN ==========
   */
  setupLoadingScreen() {
    const loader = document.getElementById('genshin-loader');
    if (!loader) return;

    // Animate progress bar
    this.animateProgress();

    // Fade out loader after duration
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, this.config.fadeOutDuration);
    }, this.config.loaderDuration);

    // Remove loader on window load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('loader-hidden');
        setTimeout(() => {
          loader.style.display = 'none';
        }, this.config.fadeOutDuration);
      }, 300);
    });
  }

  /**
   * Animate progress bar
   */
  animateProgress() {
    const progressBar = document.querySelector('.loader-progress-bar');
    if (!progressBar) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) progress = 100;
      progressBar.style.width = progress + '%';

      if (progress === 100) {
        clearInterval(interval);
      }
    }, 300);
  }

  /**
   * ========== MOBILE DETECTION ==========
   */
  setupMobileDetection() {
    const isMobile = this.detectMobileDevice();
    const currentPath = window.location.pathname;
    const isM = currentPath.startsWith('/m/');

    if (isMobile && !isM) {
      // Redirect desktop user to mobile version
      const newPath = '/m' + currentPath;
      window.location.href = newPath;
    } else if (!isMobile && isM) {
      // Redirect mobile user on desktop to desktop version
      const newPath = currentPath.replace('/m', '');
      window.location.href = newPath || '/';
    }
  }

  /**
   * Detect if user is on mobile device
   */
  detectMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check user agent
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
      return true;
    }

    // Check touch points
    if (navigator.maxTouchPoints > 1) {
      return true;
    }

    // Check screen width on desktop
    if (window.innerWidth <= 768) {
      return true;
    }

    return false;
  }

  /**
   * ========== LANGUAGE ROUTING ==========
   */
  setupLanguageRouting() {
    const userLanguage = this.detectLanguage();
    const currentPath = window.location.pathname;

    // Check if current path has language code
    const pathParts = currentPath.split('/').filter(p => p);
    const hasLanguageCode = this.config.supportedLanguages.includes(pathParts[0]);

    if (!hasLanguageCode && userLanguage) {
      // Add language code to path
      const isMobile = currentPath.startsWith('/m/');
      const basePath = isMobile ? '/m/' : '/';
      const newPath = basePath + userLanguage + currentPath.replace(/^\/m?/, '');
      window.location.href = newPath;
    }
  }

  /**
   * Detect user's preferred language
   */
  detectLanguage() {
    // Check localStorage
    const storedLang = localStorage.getItem('preferred-language');
    if (storedLang && this.config.supportedLanguages.includes(storedLang)) {
      return storedLang;
    }

    // Check browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0].toLowerCase();
    if (this.config.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    // Check cookie
    const cookieLang = this.getCookie('mi18nLang');
    if (cookieLang && this.config.supportedLanguages.includes(cookieLang)) {
      return cookieLang;
    }

    return this.config.defaultLanguage;
  }

  /**
   * Get cookie value
   */
  getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  /**
   * ========== VIDEO HERO ==========
   */
  setupVideoHero() {
    const heroVideo = document.querySelector('.hero-video-bg');
    if (!heroVideo) return;

    // Auto-play video
    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.play().catch(err => {
        console.log('Video autoplay not permitted:', err);
        // Fallback: show poster image
        heroVideo.style.display = 'none';
      });
    });

    // Loop video
    heroVideo.addEventListener('ended', () => {
      heroVideo.currentTime = 0;
      heroVideo.play();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroVideo.pause();
      } else {
        heroVideo.play().catch(err => {
          console.log('Video play failed:', err);
        });
      }
    });

    // Responsive video management
    this.handleVideoResponsive(heroVideo);
  }

  /**
   * Handle responsive video (reduce quality on mobile)
   */
  handleVideoResponsive(video) {
    const updateVideo = () => {
      const width = window.innerWidth;
      if (width < 768) {
        video.style.height = 'auto';
        video.style.objectFit = 'cover';
      }
    };

    updateVideo();
    window.addEventListener('resize', updateVideo);
  }

  /**
   * ========== SCROLL EFFECTS ==========
   */
  setupScrollEffects() {
    // Parallax hero on scroll
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      window.addEventListener('scroll', this.throttle(() => {
        const scrollY = window.scrollY;
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }, 16)); // ~60fps
    }

    // Fade elements on scroll
    this.setupScrollFadeElements();
  }

  /**
   * Setup fade elements on scroll
   */
  setupScrollFadeElements() {
    const elements = document.querySelectorAll('.scroll-fade');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Throttle function for scroll events
   */
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * ========== UTILITY METHODS ==========
   */

  /**
   * Set language preference
   */
  setLanguage(lang) {
    if (!this.config.supportedLanguages.includes(lang)) {
      lang = this.config.defaultLanguage;
    }
    localStorage.setItem('preferred-language', lang);
    // Redirect to new language
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p);
    const isMobile = currentPath.startsWith('/m/');

    // Remove old language code if exists
    let newPathParts = pathParts;
    if (this.config.supportedLanguages.includes(pathParts[0])) {
      newPathParts = pathParts.slice(1);
    }

    const basePath = isMobile ? '/m/' : '/';
    const newPath = basePath + lang + '/' + newPathParts.join('/');
    window.location.href = newPath;
  }

  /**
   * Get current language from path
   */
  getCurrentLanguage() {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const isMobile = window.location.pathname.startsWith('/m/');
    const langIndex = isMobile ? 1 : 0;

    if (this.config.supportedLanguages.includes(pathParts[langIndex])) {
      return pathParts[langIndex];
    }

    return this.config.defaultLanguage;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.genshinUI = new GenshinUI();
  });
} else {
  window.genshinUI = new GenshinUI();
}

// Expose methods to global scope
window.setLanguage = (lang) => {
  if (window.genshinUI) {
    window.genshinUI.setLanguage(lang);
  }
};

window.getCurrentLanguage = () => {
  if (window.genshinUI) {
    return window.genshinUI.getCurrentLanguage();
  }
  return 'en';
};
