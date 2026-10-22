/* ===== CHOP 46 — Premium JavaScript Engine v2.0 ===== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Preloader =====
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader?.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hidePreloader, 1200));
  setTimeout(hidePreloader, 2500); // Fallback

  // ===== Theme Toggle (Dark/Light) =====
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('chop46-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('chop46-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark'
      ? '<i class="fas fa-sun" aria-hidden="true"></i>'
      : '<i class="fas fa-moon" aria-hidden="true"></i>';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  // ===== Live Open/Closed Status =====
  function updateLiveStatus() {
    const statusEl = document.getElementById('liveStatus');
    if (!statusEl) return;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes;

    // Business hours: 12:00-15:30 (720-930) and 16:30-25:00 (990-1500, i.e., 1:00 AM next day)
    const isOpen = (time >= 720 && time <= 930) || (time >= 990) || (time <= 60);

    statusEl.className = `live-status ${isOpen ? 'open' : 'closed'}`;
    statusEl.innerHTML = `<span class="status-dot"></span> ${isOpen ? 'Open Now' : 'Closed'}`;
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);

  // ===== Announcement Banner =====
  const announcementClose = document.getElementById('announcementClose');
  const announcementBar = document.querySelector('.announcement-bar');
  const dismissed = sessionStorage.getItem('chop46-announcement-dismissed');

  if (dismissed && announcementBar) {
    announcementBar.classList.add('hidden');
    document.body.classList.remove('has-announcement');
  }
  announcementClose?.addEventListener('click', () => {
    announcementBar?.classList.add('hidden');
    document.body.classList.remove('has-announcement');
    sessionStorage.setItem('chop46-announcement-dismissed', 'true');
  });

  // ===== Navbar Scroll =====
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.querySelector('.scroll-progress');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    if (!navbar) return;
    const scrollY = window.scrollY;

    // Navbar style
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else if (document.querySelector('.hero')) {
      navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }

    // Back to top button
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Mobile Menu =====
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ===== Intersection Observer - Fade In Animations =====
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    fadeObserver.observe(el);
  });

  // ===== Gallery Lightbox with Prev/Next =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let galleryImages = [];
  let currentGalleryIndex = 0;

  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    const img = item.querySelector('img');
    if (img) galleryImages.push(img.src);

    item.addEventListener('click', () => {
      if (img && lightbox && lightboxImg) {
        currentGalleryIndex = idx;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
      }
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image in fullscreen');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  };
  const showLightboxImage = (direction) => {
    if (galleryImages.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); showLightboxImage(-1); });
  lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); showLightboxImage(1); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(-1);
    if (e.key === 'ArrowRight') showLightboxImage(1);
  });

  // ===== Menu Category Filter =====
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item[data-category]');
  const menuHeaders = document.querySelectorAll('.menu-category-header[data-category]');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      menuTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      filterMenuItems(category);
    });
  });

  function filterMenuItems(category) {
    const searchQuery = document.getElementById('menuSearch')?.value?.toLowerCase() || '';
    const dietFilter = document.querySelector('.diet-btn.active-veg, .diet-btn.active-nonveg')?.getAttribute('data-diet') || 'all';

    menuItems.forEach(item => {
      const matchCategory = category === 'all' || item.getAttribute('data-category') === category;
      const itemName = (item.querySelector('.menu-item-name')?.textContent || '').toLowerCase();
      const itemDesc = (item.querySelector('.menu-item-desc')?.textContent || '').toLowerCase();
      const matchSearch = !searchQuery || itemName.includes(searchQuery) || itemDesc.includes(searchQuery);
      const itemDiet = item.getAttribute('data-diet') || 'all';
      const matchDiet = dietFilter === 'all' || itemDiet === dietFilter;

      item.classList.toggle('hidden', !(matchCategory && matchSearch && matchDiet));
    });

    menuHeaders.forEach(header => {
      const headerCategory = header.getAttribute('data-category');
      const matchCategory = category === 'all' || headerCategory === category;

      if (!matchCategory) {
        header.classList.add('hidden');
        return;
      }

      // Check if any visible items exist in this category
      const visibleItems = document.querySelectorAll(`.menu-item[data-category="${headerCategory}"]:not(.hidden)`);
      header.classList.toggle('hidden', visibleItems.length === 0);
    });

    // Show no results message
    const noResults = document.getElementById('menuNoResults');
    const anyVisible = document.querySelector('.menu-item:not(.hidden)');
    if (noResults) noResults.style.display = anyVisible ? 'none' : 'block';
  }

  // ===== Menu Search =====
  const menuSearch = document.getElementById('menuSearch');
  menuSearch?.addEventListener('input', () => {
    const activeTab = document.querySelector('.menu-tab.active');
    const category = activeTab?.getAttribute('data-category') || 'all';
    filterMenuItems(category);
  });

  // ===== Veg/Non-Veg Diet Toggle =====
  const dietBtns = document.querySelectorAll('.diet-btn');
  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dietBtns.forEach(b => {
        b.classList.remove('active-all', 'active-veg', 'active-nonveg');
      });
      const diet = btn.getAttribute('data-diet');
      if (diet === 'all') btn.classList.add('active-all');
      else if (diet === 'veg') btn.classList.add('active-veg');
      else if (diet === 'nonveg') btn.classList.add('active-nonveg');

      const activeTab = document.querySelector('.menu-tab.active');
      const category = activeTab?.getAttribute('data-category') || 'all';
      filterMenuItems(category);
    });
  });

  // ===== Cart System (WhatsApp Order Builder) =====
  const cart = {};
  const cartFab = document.getElementById('cartFab');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartCheckout = document.getElementById('cartCheckout');

  function openCart() {
    cartDrawer?.classList.add('open');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer?.classList.remove('open');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartFab?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Add to order buttons
  document.querySelectorAll('.add-to-order').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'));
      if (!name || !price) return;

      if (cart[name]) {
        cart[name].qty += 1;
      } else {
        cart[name] = { price, qty: 1 };
      }

      // Visual feedback
      btn.classList.add('added');
      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = '<i class="fas fa-plus"></i> Add';
      }, 1500);

      updateCart();
    });
  });

  function updateCart() {
    const items = Object.entries(cart);
    const totalItems = items.reduce((sum, [, v]) => sum + v.qty, 0);
    const totalPrice = items.reduce((sum, [, v]) => sum + (v.price * v.qty), 0);

    // Update FAB
    if (cartFab) {
      cartFab.classList.toggle('empty', totalItems === 0);
    }
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
    }

    // Update drawer body
    if (cartBody) {
      if (items.length === 0) {
        cartBody.innerHTML = `
          <div class="cart-empty">
            <i class="fas fa-shopping-bag"></i>
            <p>Your order is empty</p>
            <p style="font-size: 0.8rem; margin-top: 8px;">Add items from the menu to build your WhatsApp order</p>
          </div>`;
      } else {
        cartBody.innerHTML = items.map(([name, { price, qty }]) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${name}</h4>
              <span>₹${price} each</span>
            </div>
            <div class="cart-item-actions">
              <button class="cart-qty-btn" onclick="window.cartAction('${name}', 'minus')" aria-label="Decrease quantity">−</button>
              <span class="cart-qty">${qty}</span>
              <button class="cart-qty-btn" onclick="window.cartAction('${name}', 'plus')" aria-label="Increase quantity">+</button>
            </div>
          </div>`).join('');
      }
    }

    // Update total
    if (cartTotal) {
      cartTotal.innerHTML = `<span>Total</span><span>₹${totalPrice}</span>`;
    }

    // Update checkout button
    if (cartCheckout) {
      cartCheckout.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }
  }

  // Expose cart actions globally
  window.cartAction = (name, action) => {
    if (!cart[name]) return;
    if (action === 'plus') {
      cart[name].qty += 1;
    } else if (action === 'minus') {
      cart[name].qty -= 1;
      if (cart[name].qty <= 0) delete cart[name];
    }
    updateCart();
  };

  // WhatsApp Checkout
  cartCheckout?.addEventListener('click', () => {
    const items = Object.entries(cart);
    if (items.length === 0) return;

    const total = items.reduce((sum, [, v]) => sum + (v.price * v.qty), 0);
    let message = `🛒 *CHOP 46 Order*\n\n`;
    items.forEach(([name, { price, qty }]) => {
      message += `• ${name} x${qty} — ₹${price * qty}\n`;
    });
    message += `\n💰 *Total: ₹${total}*\n`;
    message += `\nPlease confirm my order. Thank you! 🙏`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/917710904746?text=${encoded}`, '_blank');
  });

  // Initialize cart display
  updateCart();

  // ===== Testimonial Carousel =====
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselCards = document.querySelectorAll('.review-card');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.querySelector('.carousel-dots');
  let carouselIndex = 0;
  let cardsPerView = 3;
  let autoplayTimer;

  function getCardsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!carouselTrack || carouselCards.length === 0) return;
    cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, carouselCards.length - cardsPerView);
    carouselIndex = Math.min(carouselIndex, maxIndex);
    const offset = -(carouselIndex * (100 / cardsPerView));
    carouselTrack.style.transform = `translateX(${offset}%)`;

    // Update dots
    if (dotsContainer) {
      const totalDots = maxIndex + 1;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === carouselIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => { carouselIndex = i; updateCarousel(); resetAutoplay(); });
        dotsContainer.appendChild(dot);
      }
    }
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, carouselCards.length - cardsPerView);
      carouselIndex = carouselIndex >= maxIndex ? 0 : carouselIndex + 1;
      updateCarousel();
    }, 5000);
  }

  prevBtn?.addEventListener('click', () => {
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel();
    resetAutoplay();
  });
  nextBtn?.addEventListener('click', () => {
    cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, carouselCards.length - cardsPerView);
    carouselIndex = Math.min(maxIndex, carouselIndex + 1);
    updateCarousel();
    resetAutoplay();
  });

  window.addEventListener('resize', () => updateCarousel());
  updateCarousel();
  if (carouselCards.length > 0) resetAutoplay();

  // ===== Smooth Scroll for Hash Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ===== Parallax on Hero (Desktop only) =====
  const heroContent = document.querySelector('.hero-content');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroContent && window.innerWidth > 768 && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.15;
      heroContent.style.transform = `translateY(${rate}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrolled / 800);
    }, { passive: true });
  }

  // ===== Tilt Effect on Dish Cards =====
  if (window.innerWidth > 768 && !prefersReducedMotion) {
    document.querySelectorAll('.dish-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 35;
        const rotateY = (centerX - x) / 35;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===== Active Nav Link Highlight on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sideNavItems = document.querySelectorAll('.side-nav-item[data-section]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${id}` || href === `index.html#${id}`) {
            link.classList.add('active');
          }
        });
        sideNavItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-section') === id) {
            item.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ===== Custom Cursor (Desktop) =====
  if (window.innerWidth > 768 && !prefersReducedMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .gallery-item, .dish-card, .menu-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ===== Animated Counters =====
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = Date.now();

        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          const current = eased * target;
          el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ===== WhatsApp Message Builder (Contact page) =====
  const waForm = document.getElementById('waBuilderForm');
  waForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('waName')?.value || '';
    const type = document.getElementById('waType')?.value || 'Order';
    const message = document.getElementById('waMessage')?.value || '';

    let text = `Hi CHOP 46! 👋\n`;
    if (name) text += `I'm ${name}.\n`;
    text += `I'd like to ${type.toLowerCase()}.\n`;
    if (message) text += `\n${message}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917710904746?text=${encoded}`, '_blank');
  });

  // ===== Gallery Filter (Gallery page) =====
  const galleryFilters = document.querySelectorAll('.gallery-filter .menu-tab');
  const galleryItems = document.querySelectorAll('.gallery-masonry .gallery-item');

  galleryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      galleryItems.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ===== Pages: Navbar always scrolled on non-home pages =====
  if (!document.querySelector('.hero') && navbar) {
    navbar.classList.add('scrolled');
  }
});
