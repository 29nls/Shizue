// Modern Homepage JavaScript - Interactive Effects

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== PARALLAX HERO ==========
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
    });

    // Mouse move parallax
    document.addEventListener('mousemove', function(e) {
      const x = (e.clientX / window.innerWidth) * 30;
      const y = (e.clientY / window.innerHeight) * 30;
      heroBackground.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ========== CAROUSEL NAVIGATION ==========
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (prevBtn && nextBtn) {
      nextBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: 350, behavior: 'smooth' });
      });

      prevBtn.addEventListener('click', function() {
        carousel.scrollBy({ left: -350, behavior: 'smooth' });
      });
    }
  }

  // ========== SCROLL ANIMATIONS ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all scroll-fade elements
  document.querySelectorAll('.scroll-fade').forEach(el => {
    observer.observe(el);
  });

  // ========== COUNTER ANIMATION ==========
  const stats = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    stats.forEach(stat => {
      const target = parseInt(stat.textContent);
      const increment = target / 50;
      let current = 0;

      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      };

      updateCount();
    });
  };

  // Trigger counter when stats section is visible
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ========== CARD HOVER EFFECTS ==========
  const cards = document.querySelectorAll('.post-card, .carousel-item, .category-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.position = 'relative';
      this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
      this.style.position = 'relative';
      this.style.zIndex = 'auto';
    });
  });

  // ========== SMOOTH SCROLL LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ========== SCROLL INDICATOR ANIMATION ==========
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        scrollIndicator.style.display = 'none';
      } else {
        scrollIndicator.style.display = 'block';
      }
    });
  }

  // ========== STAGGER ANIMATIONS ==========
  const animateOnScroll = (elements, staggerDelay = 100) => {
    elements.forEach((el, index) => {
      const elementObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
            }, index * staggerDelay);
            elementObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      elementObserver.observe(el);
    });
  };

  // Apply stagger animation to post cards
  const postCards = document.querySelectorAll('.post-card');
  if (postCards.length) {
    animateOnScroll(postCards, 100);
  }

  // ========== CATEGORY CLICK ==========
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const categoryLink = this.getAttribute('data-link');
      if (categoryLink) {
        window.location.href = categoryLink;
      }
    });
  });

  // ========== POST CARD CLICK ==========
  const postCardLinks = document.querySelectorAll('.post-card');
  postCardLinks.forEach(card => {
    card.addEventListener('click', function() {
      const link = this.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });

  // ========== CTA BUTTON RIPPLE EFFECT ==========
  const ctaButtons = document.querySelectorAll('.cta-btn');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ========== LOADING STATE ==========
  window.addEventListener('load', function() {
    document.body.classList.remove('loading');
  });

});

// ========== UTILITY FUNCTIONS ==========

// Debounce for scroll events
function debounce(func, wait) {
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

// Request animation frame throttle
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
