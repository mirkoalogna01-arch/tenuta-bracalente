// ============================================================
// TENUTA BRACALENTE — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- HERO TITLE: wrap words in spans for line reveal ---------- */
  document.querySelectorAll('.hero-title .line').forEach(line => {
    const text = line.textContent;
    line.innerHTML = `<span>${text}</span>`;
  });

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- STICKY CTA: hide while hero or booking form are already on screen ---------- */
  const stickyCta = document.getElementById('stickyCta');
  const prenotaSection = document.getElementById('prenota');
  const heroSection = document.getElementById('hero');
  if (stickyCta && prenotaSection && heroSection) {
    let heroVisible = true;
    let prenotaVisible = false;
    const updateStickyVisibility = () => {
      stickyCta.classList.toggle('is-hidden', heroVisible || prenotaVisible);
    };
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === heroSection) heroVisible = entry.isIntersecting;
        if (entry.target === prenotaSection) prenotaVisible = entry.isIntersecting;
      });
      updateStickyVisibility();
    }, { threshold: 0.2 });
    stickyObserver.observe(heroSection);
    stickyObserver.observe(prenotaSection);
  }

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- HERO PARALLAX (multi-layer for real depth, desktop only) ---------- */
  const heroImg = document.getElementById('heroImg');
  const heroSmoke = document.getElementById('heroSmoke');
  const heroContent = document.querySelector('.hero-content');
  const hero = document.getElementById('hero');
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  const wantsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let heroHeight = hero.offsetHeight;
  window.addEventListener('resize', () => { heroHeight = hero.offsetHeight; }, { passive: true });

  let scrollSmokeY = 0;
  const applySmokeScrollY = () => {
    heroSmoke.style.transform = `translateY(${scrollSmokeY}px)`;
  };

  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    if (y < heroHeight * 1.2) {
      heroImg.style.transform = `translateY(${y * 0.32}px) scale(${1 + y * 0.0002})`;
      scrollSmokeY = y * 0.55;
      applySmokeScrollY();
      const fadeProgress = Math.min(y / (heroHeight * 0.6), 1);
      heroContent.style.opacity = String(1 - fadeProgress);
      heroContent.style.transform = `translateY(${fadeProgress * 40}px) scale(${1 - fadeProgress * 0.04})`;
    }
    ticking = false;
  };

  if (!isSmallScreen && !wantsReducedMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();

    /* --- full-page ember sparks + cursor push interaction ---
       Each spark lives in an .ember-wrap (holds spawn position + push offset)
       with a .hero-ember inside (runs the CSS rise animation).
       Separating position from animation lets us push the wrap's transform
       without conflicting with the keyframe on the inner element. */
    const embersContainer = document.createElement('div');
    embersContainer.className = 'page-embers';
    const emberWraps = [];
    for (let i = 0; i < 24; i++) {
      const wrap = document.createElement('span');
      wrap.className = 'ember-wrap';
      const left  = (4 + Math.random() * 92).toFixed(1);
      const bot   = (Math.random() * 4).toFixed(1);
      wrap.style.cssText = `left:${left}%;bottom:${bot}%;`;
      const s = document.createElement('span');
      s.className = 'hero-ember';
      const dur   = (5.5 + Math.random() * 4.5).toFixed(2);
      const delay = (Math.random() * 8).toFixed(2);
      const ex    = ((Math.random() - 0.5) * 44).toFixed(1);
      s.style.cssText = `--dur:${dur}s;--delay:${delay}s;--ex:${ex}px;`;
      wrap.appendChild(s);
      embersContainer.appendChild(wrap);
      emberWraps.push({ el: wrap, ember: s, px: 0, py: 0, tx: 0, ty: 0 });
    }
    document.body.appendChild(embersContainer);

    // push interaction: on mousemove, embers within PUSH_R px get deflected away
    let cursorX = -9999, cursorY = -9999, pushRafId = null;
    const PUSH_R = 110, PUSH_F = 65, PUSH_LERP = 0.13;
    const runPush = () => {
      // batch reads first (avoids layout thrashing)
      const rects = emberWraps.map(w => w.ember.getBoundingClientRect());
      let anyActive = false;
      rects.forEach((rect, i) => {
        const w = emberWraps[i];
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = cx - cursorX, dy = cy - cursorY;
        const dist = Math.hypot(dx, dy);
        if (dist < PUSH_R && dist > 0.5) {
          const f = (1 - dist / PUSH_R) * PUSH_F;
          w.tx = (dx / dist) * f;
          w.ty = (dy / dist) * f;
        } else { w.tx = 0; w.ty = 0; }
        w.px += (w.tx - w.px) * PUSH_LERP;
        w.py += (w.ty - w.py) * PUSH_LERP;
        if (Math.abs(w.px) > 0.1 || Math.abs(w.py) > 0.1) {
          anyActive = true;
          w.el.style.transform = `translate(${w.px.toFixed(2)}px,${w.py.toFixed(2)}px)`;
        } else if (w.el.style.transform) {
          w.px = 0; w.py = 0;
          w.el.style.transform = '';
        }
      });
      pushRafId = anyActive ? requestAnimationFrame(runPush) : null;
    };
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX; cursorY = e.clientY;
      if (!pushRafId) pushRafId = requestAnimationFrame(runPush);
    }, { passive: true });
  }

  /* ---------- GENERIC REVEAL ON SCROLL (text, media, groups) ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-media, .reveal-group, .reveal-line');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- COUNT-UP ON STAT NUMBERS ---------- */
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out-expo for a snappy-but-smooth settle, matching the rest of the motion system
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => countObserver.observe(el));

  /* ---------- LAZY-LOAD BACKGROUND IMAGES ---------- */
  // Below-the-fold photos load only once they're close to the viewport,
  // instead of all downloading immediately on page load.
  const lazyBgEls = document.querySelectorAll('[data-bg]');
  const lazyBgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        el.classList.add('is-loaded');
        lazyBgObserver.unobserve(el);
      }
    });
  }, { rootMargin: '200px 0px' });
  lazyBgEls.forEach(el => lazyBgObserver.observe(el));

  /* ---------- ESPERIENZA: gentle scroll-linked parallax on each photo ---------- */
  // Adds a sense of depth as each "moment" image drifts past — desktop only,
  // and skipped under reduced-motion, matching the hero's own parallax rules.
  const momentMedias = document.querySelectorAll('.esperienza-moment-media');
  if (momentMedias.length && !isSmallScreen && !wantsReducedMotion) {
    let momentTicking = false;
    const updateMomentParallax = () => {
      const viewportH = window.innerHeight;
      momentMedias.forEach(el => {
        const rect = el.getBoundingClientRect();
        // progress: -1 (just below viewport) to 1 (just above), 0 at center
        const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
        const shift = progress * -24; // px of drift, kept subtle on purpose
        el.style.backgroundPosition = `center calc(50% + ${shift}px)`;
      });
      momentTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!momentTicking) {
        requestAnimationFrame(updateMomentParallax);
        momentTicking = true;
      }
    }, { passive: true });
    updateMomentParallax();
  }

  /* ============================================================
     MENU DATA + RENDER
     ============================================================ */
  const MENU = {
    antipasti: [
      { name: 'Crostini al fegatino', tag: 'classico', desc: 'Pâté di fegatini di pollo, vin santo, crostino di pane sciocco tostato sulla brace.', price: '12€' },
      { name: 'Tagliere della tenuta', tag: null, desc: 'Salumi e formaggi di nostra produzione, miele di castagno, marmellata di cipolla rossa.', price: '18€' },
      { name: 'Bruschetta al tartufo nero', tag: 'stagione', desc: 'Tartufo nero dei boschi della tenuta, burro, pane di Genzano.', price: '16€' },
      { name: 'Vellutata di topinambur', tag: 'vegetariano', desc: 'Topinambur dell\'orto, nocciole tostate, olio nuovo.', price: '11€' },
    ],
    primi: [
      { name: 'Tagliatelle al tartufo', tag: 'fatto a mano', desc: 'Pasta tirata ogni mattina, tartufo nero, burro di malga.', price: '22€' },
      { name: 'Strangozzi alla Norcina', tag: 'classico', desc: 'Salsiccia umbra, panna, un velo di tartufo nero.', price: '19€' },
      { name: 'Risotto al Sagrantino', tag: null, desc: 'Riso Carnaroli, riduzione del nostro Sagrantino, scaglie di pecorino.', price: '20€' },
      { name: 'Zuppa di farro e cicerchie', tag: 'antica ricetta', desc: 'Farro e cicerchie dell\'orto di famiglia, come la faceva Severino.', price: '15€' },
    ],
    brace: [
      { name: 'Tagliata di chianina', tag: 'brace di quercia', desc: 'Chianina al sangue, rucola selvatica, scaglie di pecorino di fossa.', price: '34€' },
      { name: 'Costata alla brace', tag: 'da condividere', desc: 'Frollatura 30 giorni, sale di Cervia, rosmarino della tenuta.', price: '38€' },
      { name: 'Salsiccia e fagioli al fiasco', tag: 'classico', desc: 'Salsiccia di nostra produzione, fagioli cotti lentamente nel fiasco.', price: '17€' },
      { name: 'Agnello scottadito', tag: 'brace di quercia', desc: 'Agnello locale, patate arrosto, salsa al rosmarino.', price: '26€' },
    ],
    dolci: [
      { name: 'Tiramisù della nonna', tag: 'ricetta storica', desc: 'La ricetta originale di Severino, immutata dal 1962.', price: '9€' },
      { name: 'Torta al testo dolce', tag: null, desc: 'Cotta sul testo di ferro, miele e noci della tenuta.', price: '8€' },
      { name: 'Crostata di visciole', tag: 'stagione', desc: 'Visciole del frutteto, pasta frolla burrosa.', price: '9€' },
      { name: 'Vin santo e cantucci', tag: 'da fine pasto', desc: 'Vin santo di nostra produzione, cantucci fatti in casa.', price: '10€' },
    ],
  };

  const menuList = document.getElementById('menuList');
  const menuTabs = document.querySelectorAll('.menu-tab');

  function renderMenu(cat) {
    menuList.innerHTML = '';
    MENU[cat].forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.innerHTML = `
        <span class="menu-item-num">${String(i + 1).padStart(2, '0')}</span>
        <div class="menu-item-body">
          <h3>${item.name}${item.tag ? `<span class="menu-tag">${item.tag}</span>` : ''}</h3>
          <p>${item.desc}</p>
        </div>
        <span class="menu-item-price">${item.price}</span>
      `;
      menuList.appendChild(row);
    });
    // staggered reveal
    requestAnimationFrame(() => {
      const rows = menuList.querySelectorAll('.menu-item');
      rows.forEach((row, i) => {
        setTimeout(() => row.classList.add('is-shown'), i * 70);
      });
    });
  }

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderMenu(tab.dataset.cat);
    });
  });

  renderMenu('antipasti');

  /* ============================================================
     GALLERIA + LIGHTBOX
     ============================================================ */
  const GALLERY = [
    { seed: 'bracalente-galleria-sala', label: 'La sala' },
    { seed: 'bracalente-galleria-brace', label: 'La brace' },
    { seed: 'bracalente-galleria-cucina', label: 'La cucina' },
    { seed: 'bracalente-galleria-piatti', label: 'I piatti' },
    { seed: 'bracalente-galleria-cantina', label: 'La cantina' },
    { seed: 'bracalente-galleria-esterno', label: 'L\'esterno' },
  ];

  const galleriaGrid = document.getElementById('galleriaGrid');
  GALLERY.forEach((photo, i) => {
    const item = document.createElement('button');
    item.className = 'galleria-item reveal-media';
    item.type = 'button';
    item.dataset.index = i;
    item.setAttribute('aria-label', `Apri foto: ${photo.label}`);
    item.innerHTML = `
      <span class="img-fill" data-bg="https://picsum.photos/seed/${photo.seed}/900/900"></span>
      <span class="galleria-item-label">${photo.label}</span>
    `;
    galleriaGrid.appendChild(item);
  });

  // newly created .reveal-media and [data-bg] nodes were created after the
  // page-load observers below were already wired up further down, so they
  // are picked up by re-running the same observer logic against this subtree
  galleriaGrid.querySelectorAll('.reveal-media').forEach(el => revealObserver.observe(el));
  galleriaGrid.querySelectorAll('[data-bg]').forEach(el => lazyBgObserver.observe(el));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaptionText = document.getElementById('lightboxCaptionText');
  const lightboxCount = document.getElementById('lightboxCount');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleriaItems = galleriaGrid.querySelectorAll('.galleria-item');

  let currentIndex = 0;
  let lastFocusedItem = null;

  function showPhoto(index) {
    currentIndex = (index + GALLERY.length) % GALLERY.length;
    const photo = GALLERY[currentIndex];
    // full-size image is only requested once the lightbox actually opens
    // on this photo — this is the "lazy load" boundary for the lightbox
    lightboxImg.src = `https://picsum.photos/seed/${photo.seed}/1600/1200`;
    lightboxImg.alt = photo.label;
    lightboxCaptionText.textContent = photo.label;
    lightboxCount.textContent = `${currentIndex + 1} / ${GALLERY.length}`;
  }

  function openLightbox(index) {
    lastFocusedItem = document.activeElement;
    showPhoto(index);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocusedItem) lastFocusedItem.focus();
  }

  galleriaItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showPhoto(currentIndex - 1));
  lightboxNext.addEventListener('click', () => showPhoto(currentIndex + 1));

  // click on the dark backdrop (but not on the photo/controls) also closes it
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });

  /* ============================================================
     RECENSIONI DATA + RENDER
     ============================================================ */
  const REVIEWS = [
    { stars: 5, text: 'La tagliata di chianina è la migliore che abbia mangiato fuori casa. Si sente che la brace è vera, di legna.', author: 'Marco T.', src: 'Google' },
    { stars: 5, text: 'Posto che sembra fermo nel tempo, nel senso buono. Il tiramisù della nonna vale da solo il viaggio da Roma.', author: 'Giulia F.', src: 'TripAdvisor' },
    { stars: 5, text: 'Cantina incredibile, ci hanno fatto assaggiare un Sagrantino che non era nemmeno in carta. Servizio caloroso, mai impostato.', author: 'Andrea B.', src: 'Google' },
    { stars: 4, text: 'Atmosfera autentica, prezzi onesti per la qualità. Gli strangozzi alla norcina sono da provare assolutamente.', author: 'Sara M.', src: 'TripAdvisor' },
    { stars: 5, text: 'Ci portiamo la famiglia da vent\'anni. Elisa ha mantenuto intatta l\'anima del posto di suo nonno.', author: 'Roberto C.', src: 'Google' },
  ];

  const recTrack = document.getElementById('recTrack');
  REVIEWS.forEach(r => {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <span class="rec-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
      <p class="rec-text">"${r.text}"</p>
      <div class="rec-author"><strong>${r.author}</strong><span>${r.src}</span></div>
    `;
    recTrack.appendChild(card);
  });

  // Stagger the cards in as the row scrolls into view, rather than all at once
  const recCards = recTrack.querySelectorAll('.rec-card');
  const recObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        recCards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-shown'), i * 90);
        });
        recObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  recObserver.observe(recTrack);

  /* ---------- MAGNETIC BUTTONS (subtle, desktop-only, respects reduced motion) ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!prefersReducedMotion && !isTouchDevice) {
    document.querySelectorAll('.btn').forEach(btn => {
      const strength = 10; // max pixel offset — kept small so it reads as polish, not a gimmick
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength - 2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- CURSOR SPARKS (desktop + no reduced motion) ---------- */
  if (!isSmallScreen && !wantsReducedMotion) {
    let lastSparkMs = 0;
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkMs < 28) return; // ~35 sparks/sec max
      lastSparkMs = now;
      const sp = document.createElement('span');
      sp.className = 'cursor-spark';
      sp.style.left = `${e.clientX}px`;
      sp.style.top  = `${e.clientY}px`;
      sp.style.setProperty('--sx', `${((Math.random() - 0.5) * 22).toFixed(1)}px`);
      sp.style.setProperty('--sy', `${(-14 - Math.random() * 24).toFixed(1)}px`);
      document.body.appendChild(sp);
      sp.addEventListener('animationend', () => sp.remove(), { once: true });
    }, { passive: true });
  }

  /* ---------- BOOKING FORM ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formNote = document.getElementById('formNote');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(bookingForm);
    const nome = data.get('nome');
    const submitBtn = bookingForm.querySelector('.form-submit');
    const submitLabel = submitBtn.querySelector('span');
    const originalLabel = submitLabel.textContent;

    submitBtn.disabled = true;
    submitLabel.textContent = 'Invio in corso…';
    formNote.textContent = '';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    })
      .then(() => {
        formNote.textContent = `Grazie ${nome}! La tua richiesta è stata registrata. Ti contatteremo a breve per confermare.`;
        formNote.style.color = 'var(--brass)';
        bookingForm.reset();
      })
      .catch(() => {
        formNote.textContent = `Si è verificato un problema nell'invio. Chiamaci direttamente al numero in fondo alla pagina.`;
        formNote.style.color = 'var(--wine-bright)';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitLabel.textContent = originalLabel;
      });

    // Questo invio funziona automaticamente una volta pubblicato su Netlify,
    // grazie agli attributi data-netlify="true" sul form in index.html.
    // Le richieste arrivano nella dashboard Netlify, sezione "Forms".
    // In locale (file:// o anteprima) la fetch a '/' fallirà: è normale,
    // funzionerà appena il sito è online su Netlify.
  });

  /* ---------- date min = today ---------- */
  const dateInput = bookingForm.querySelector('input[name="data"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

});
