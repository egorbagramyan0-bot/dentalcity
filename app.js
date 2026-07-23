/**
 * Dental City (Дентал Сити) - Interactive Website Application
 */

/**
 * Предотвращает висячие предлоги и союзы в русском тексте,
 * заменяя пробелы после них на неразрывные (non-breaking spaces).
 */
function nbsp(text) {
  if (typeof text !== 'string') return text;
  const regex = /(^|[\s,.:;?!"'«»()\[\]])(в|на|с|у|к|о|за|по|из|от|до|без|для|при|под|над|про|обо|и|а|но|или|не|бы|ли|же|да|как|так)\s+/gi;
  return text.replace(regex, '$1$2\u00A0');
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initServicesCatalog();
  initReviewsFilter();
  initFAQ();
  initBookingModal();
  initGalleryModal();
});

/* ==========================================================================
   Navigation & Sticky Header
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.staggered-menu-wrapper');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (menuToggle && mobileMenu) {
    const panel = mobileMenu.querySelector('.staggered-menu-panel');
    const closeBtn = document.getElementById('mobile-menu-close');
    const preLayers = Array.from(mobileMenu.querySelectorAll('.sm-prelayer'));
    const itemLabels = Array.from(mobileMenu.querySelectorAll('.sm-panel-itemLabel'));
    const socialTitle = mobileMenu.querySelector('.sm-socials-title');
    const socialLinks = Array.from(mobileMenu.querySelectorAll('.sm-socials-link'));

    let isOpen = false;
    let isAnimating = false;

    // Initialize initial offscreen state
    if (typeof gsap !== 'undefined') {
      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
      gsap.set(itemLabels, { yPercent: 140, rotation: 10 });
      if (socialTitle) {
        gsap.set(socialTitle, { opacity: 0 });
      }
      if (socialLinks.length) {
        gsap.set(socialLinks, { y: 25, opacity: 0 });
      }
    } else {
      // Fallback CSS state setup
      panel.style.transform = 'translateX(100%)';
      preLayers.forEach(l => l.style.transform = 'translateX(100%)');
      itemLabels.forEach(il => il.style.transform = 'translateY(140%) rotate(10deg)');
      if (socialTitle) socialTitle.style.opacity = '0';
      socialLinks.forEach(sl => {
        sl.style.opacity = '0';
        sl.style.transform = 'translateY(25px)';
      });
    }

    function toggleMenu() {
      if (isAnimating) return;
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      if (isAnimating || isOpen) return;
      isAnimating = true;
      isOpen = true;
      mobileMenu.classList.add('active');
      menuToggle.classList.add('active');
      if (header) header.classList.add('menu-active');

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            isAnimating = false;
          }
        });

        // Stagger layers slide in
        preLayers.forEach((layer, i) => {
          tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (preLayers.length ? 0.08 : 0);
        const panelDuration = 0.65;

        // Panel slide in
        tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

        // Stagger menu items
        if (itemLabels.length) {
          const itemsStart = panelInsertTime + panelDuration * 0.15;
          tl.to(itemLabels, {
            yPercent: 0,
            rotation: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.08
          }, itemsStart);
        }

        // Stagger social links
        if (socialTitle || socialLinks.length) {
          const socialsStart = panelInsertTime + panelDuration * 0.4;
          if (socialTitle) {
            tl.to(socialTitle, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out'
            }, socialsStart);
          }
          if (socialLinks.length) {
            tl.to(socialLinks, {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power3.out',
              stagger: 0.08
            }, socialsStart + 0.04);
          }
        }

        tl.play(0);
      } else {
        // Fallback: JS-triggered CSS transitions
        panel.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        preLayers.forEach((l, idx) => {
          l.style.transition = `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s`;
        });
        itemLabels.forEach((il, idx) => {
          il.style.transition = `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + idx * 0.05}s`;
        });
        if (socialTitle) {
          socialTitle.style.transition = 'opacity 0.4s ease 0.3s';
        }
        socialLinks.forEach((sl, idx) => {
          sl.style.transition = `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + idx * 0.05}s, opacity 0.5s ease ${0.3 + idx * 0.05}s`;
        });

        // Trigger reflow
        panel.offsetHeight;

        panel.style.transform = 'none';
        preLayers.forEach(l => l.style.transform = 'none');
        itemLabels.forEach(il => il.style.transform = 'none');
        if (socialTitle) socialTitle.style.opacity = '1';
        socialLinks.forEach(sl => {
          sl.style.opacity = '1';
          sl.style.transform = 'none';
        });

        setTimeout(() => {
          isAnimating = false;
        }, 800);
      }
    }

    function closeMenu() {
      if (isAnimating || !isOpen) return;
      isAnimating = true;
      isOpen = false;
      menuToggle.classList.remove('active');
      if (header) header.classList.remove('menu-active');

      if (typeof gsap !== 'undefined') {
        gsap.to([panel, ...preLayers], {
          xPercent: 100,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            mobileMenu.classList.remove('active');
            // Reset states
            gsap.set(itemLabels, { yPercent: 140, rotation: 10 });
            if (socialTitle) {
              gsap.set(socialTitle, { opacity: 0 });
            }
            if (socialLinks.length) {
              gsap.set(socialLinks, { y: 25, opacity: 0 });
            }
            isAnimating = false;
          }
        });
      } else {
        // Fallback close
        panel.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        preLayers.forEach(l => {
          l.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        panel.style.transform = 'translateX(100%)';
        preLayers.forEach(l => l.style.transform = 'translateX(100%)');
        
        setTimeout(() => {
          mobileMenu.classList.remove('active');
          // Reset inline styles
          itemLabels.forEach(il => {
            il.style.transition = 'none';
            il.style.transform = 'translateY(140%) rotate(10deg)';
          });
          if (socialTitle) {
            socialTitle.style.transition = 'none';
            socialTitle.style.opacity = '0';
          }
          socialLinks.forEach(sl => {
            sl.style.transition = 'none';
            sl.style.opacity = '0';
            sl.style.transform = 'translateY(25px)';
          });
          isAnimating = false;
        }, 400);
      }
    }

    menuToggle.addEventListener('click', toggleMenu);
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking links
    mobileMenu.querySelectorAll('.sm-panel-item').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (isOpen && !panel.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }
}

/* ==========================================================================
   Services & Price Catalog (Filter & Search)
   ========================================================================== */
function initServicesCatalog() {
  const grid = document.getElementById('services-grid');
  const searchInput = document.getElementById('service-search');
  const tabBtns = document.querySelectorAll('.tab-btn');

  if (!grid || typeof CLINIC_DATA === 'undefined') return;

  let currentCategory = 'all';
  let searchQuery = '';

  function renderServices() {
    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    const filtered = CLINIC_DATA.services.filter(s => {
      const matchCat = currentCategory === 'all' || s.category === currentCategory;
      const matchSearch = queryWords.length === 0 || queryWords.every(word => 
        s.title.toLowerCase().includes(word) ||
        s.description.toLowerCase().includes(word) ||
        s.categoryName.toLowerCase().includes(word)
      );
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 16px; border: 1px dashed #CBD5E1;">
          <p style="font-size: 1.1rem; color: #64748B; margin-bottom: 12px;">По вашему запросу ничего не найдено.</p>
          <button class="btn btn-secondary btn-sm" id="reset-filter-btn">Сбросить поиск</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          currentCategory = 'all';
          tabBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          renderServices();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(s => `
      <div class="service-card" data-id="${s.id}">
        <div>
          <div class="service-card-top" style="justify-content: flex-end;">
            <span class="service-price">${s.priceFormatted}</span>
          </div>
          <h4 class="service-title">${nbsp(s.title)}</h4>
          <p class="service-desc">${nbsp(s.description)}</p>
        </div>
        <div class="service-card-bottom">
          <span style="font-size: 0.8rem; color: #0D9488; font-weight: 600;">
            ✓ Гарантия & Фотопротокол
          </span>
          <button class="btn btn-primary btn-sm book-service-btn" data-title="${s.title}" data-price="${s.priceFormatted}">
            Записаться
          </button>
        </div>
      </div>
    `).join('');

    // Attach click events to "Записаться"
    grid.querySelectorAll('.book-service-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        openBookingModal(title);
      });
    });
  }

  // Event Listeners for category tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderServices();
    });
  });

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderServices();
    });
  }

  // Initial render
  renderServices();
}



/* ==========================================================================
   Reviews Filter
   ========================================================================== */
function initReviewsFilter() {
  const container = document.getElementById('reviews-container');
  if (!container || typeof CLINIC_DATA === 'undefined') return;

  container.innerHTML = CLINIC_DATA.reviews.slice(0, 3).map(r => `
    <div class="review-card">
      <div>
        <div class="review-user">
          <div class="user-avatar">${r.avatar}</div>
          <div class="user-info">
            <h5>${nbsp(r.name)}</h5>
            <span class="user-level">${r.badge}</span>
          </div>
        </div>
        <div style="color: #F59E0B; margin-bottom: 12px; font-size: 1.1rem;">
          ${'★'.repeat(r.rating)}
        </div>
        <p class="review-text">"${nbsp(r.text)}"</p>
      </div>
      <div class="review-footer">
        <span>${r.date} • Проверено на Яндекс Картах</span>
        <span style="color: #0284C7; font-weight: 700;">⭐️ 5.0</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
function initFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList || typeof CLINIC_DATA === 'undefined') return;

  faqList.innerHTML = CLINIC_DATA.faq.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'open' : ''}">
      <div class="faq-question">
        <span>${nbsp(item.q)}</span>
        <span class="faq-toggle-icon">▼</span>
      </div>
      <div class="faq-answer" style="${idx === 0 ? 'max-height: 200px;' : ''}">
        <div class="faq-answer-inner">
          ${nbsp(item.a)}
        </div>
      </div>
    </div>
  `).join('');

  faqList.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close other items
      faqList.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
      }
    });
  });
}

/* ==========================================================================
   Appointment Booking Modal
   ========================================================================== */
let openBookingModal = function() {};

function initBookingModal() {
  const overlay = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('booking-form');
  const serviceInput = document.getElementById('modal-service');
  const dateInput = document.getElementById('modal-time');

  if (!overlay || !form) return;

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  openBookingModal = function(serviceTitle = '') {
    if (serviceInput && serviceTitle) {
      serviceInput.value = serviceTitle;
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Attach to all global triggers
  document.querySelectorAll('.open-booking-trigger').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Form submission handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('modal-name').value;
    const phone = document.getElementById('modal-phone').value;
    const service = document.getElementById('modal-service').value || 'Первичный осмотр';

    closeModal();
    showToast(`Спасибо, ${name}! Мы свяжемся с вами по номеру ${phone} для подтверждения записи.`);

    // Optional whatsapp redirect simulation or direct open
    form.reset();
  });
}

/* ==========================================================================
   Gallery Modal / Lightbox
   ========================================================================== */
function initGalleryModal() {
  const galleryImgs = document.querySelectorAll('.gallery-thumb');
  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      window.open(src, '_blank');
    });
  });
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerHTML = `
    <span style="font-size: 1.4rem; color: #22C55E;">✓</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
