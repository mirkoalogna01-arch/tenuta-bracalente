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

  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    if (y < heroHeight * 1.2) {
      // background image: slowest layer, slight scale-up to avoid edge gaps
      heroImg.style.transform = `translateY(${y * 0.32}px) scale(${1 + y * 0.0002})`;
      // smoke/atmosphere: faster layer, creates parallax separation between planes
      heroSmoke.style.transform = `translateY(${y * 0.55}px)`;
      // content: fades and settles back slightly as the section is left,
      // like the title is receding into the scene rather than just scrolling off
      const fadeProgress = Math.min(y / (heroHeight * 0.6), 1);
      heroContent.style.opacity = String(1 - fadeProgress);
      heroContent.style.transform = `translateY(${fadeProgress * 40}px) scale(${1 - fadeProgress * 0.04})`;
    }
    ticking = false;
  };
  // Skip the scroll-linked transform on small screens (touch scrolling makes
  // it read as jank) and when the person has asked for reduced motion.
  if (!isSmallScreen && !wantsReducedMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
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

  /* ---------- BOOKING FORM ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formNote = document.getElementById('formNote');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(bookingForm);
    const nome = data.get('nome');

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
