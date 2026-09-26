/**
 * SYNTEK GROUP — Interactive Application Logic
 * Fabricación Metalmecánica & Carpintería Industrial (Metal & Madera)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initCatalogFilters();
  initStepper();
  initModals();
  initTouchGestures();
  initScrollSpy();
});

/* ==========================================================================
   1. THEME TOGGLE SYSTEM (Dark Steel / Light Studio)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlEl = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('syntek_theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('syntek_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION & DRAWER SYSTEM
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = idNavLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('mobile-open');
      if (isOpen) {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking any nav link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. CATALOG FILTERING & SEARCH SYSTEM
   ========================================================================== */
let currentFilter = 'all';

function initCatalogFilters() {
  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }
}

window.selectTab = function(filterCategory, btnEl) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  currentFilter = filterCategory;
  filterCatalog();
};

function filterCatalog() {
  const searchInput = document.getElementById('catalogSearchInput');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const productCards = document.querySelectorAll('#mainCatalogGrid .product-card');
  let visibleCount = 0;

  productCards.forEach(card => {
    const category = card.getAttribute('data-category');
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    const desc = (card.getAttribute('data-desc') || '').toLowerCase();
    const materials = (card.getAttribute('data-materials') || '').toLowerCase();

    const matchesFilter = (currentFilter === 'all' || category === currentFilter);
    const matchesSearch = (!searchVal || title.includes(searchVal) || desc.includes(searchVal) || materials.includes(searchVal));

    if (matchesFilter && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countBadge = document.getElementById('catalogCountBadge');
  if (countBadge) {
    countBadge.textContent = `Mostrando ${visibleCount} de ${productCards.length} estructuras`;
  }
}

/* ==========================================================================
   4. TECHNICAL ROUTE STEPPER (Del Concepto al Montaje)
   ========================================================================== */
const stepDetails = [
  { title: "Paso 1: Recepción de Necesidad o Diseño", desc: "Estudiamos detalladamente la información disponible suministrada por el cliente (planos de arquitectura en AutoCAD, bocetos conceptuales, medidas aproximadas o fotos de inspiración) para evaluar factibilidad estructural y proponer soluciones óptimas de fabricación." },
  { title: "Paso 2: Verificación Dimensional en Sitio", desc: "Nos desplazamos dentro de Bogotá y sabana aledaña para el levantamiento de medidas exactas con distanciómetro láser y verificación de condiciones de montaje en sitio (puntos de anclaje, accesos, altura útil)." },
  { title: "Paso 3: Ajuste, Planos 3D e Inteligencia Artificial", desc: "Definimos el dimensionamiento estructural y el despiece técnico en planos CAD de taller. Utilizamos herramientas avanzadas de renderizado 3D e inteligencia artificial para optimizar el diseño y visualizar la propuesta antes de cortar material." },
  { title: "Paso 4: Manufactura & Ensamble en Taller", desc: "Transformación de perfiles metálicos y maderas mediante corte láser/mecánico, biselado, doblado CNC y soldadura técnica MIG/TIG bajo supervisión de nuestro jefe de planta con más de 21 años de experiencia." },
  { title: "Paso 5: Protección & Acabado Horneado", desc: "Preparación química de superficies contra oxidación y curado al horno con pintura electrostática de alta resistencia mecánica a rayones y agentes químicos de limpieza." },
  { title: "Paso 6: Despacho e Instalación Profesional", desc: "Transporte e instalación final en obra a cargo de nuestro personal técnico en Bogotá, garantizando plomada, fijación rígida y limpieza final del área." }
];

function initStepper() {
  window.activateStep = function(stepNum) {
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, idx) => {
      if (idx === stepNum - 1) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    const detailObj = stepDetails[stepNum - 1];
    const titleEl = document.getElementById('stepDetailTitle');
    const descEl = document.getElementById('stepDetailDesc');
    if (titleEl) titleEl.textContent = detailObj.title;
    if (descEl) descEl.textContent = detailObj.desc;
  };
}

/* ==========================================================================
   5. INTERACTIVE MODALS (Lightbox & Quote Wizard)
   ========================================================================== */
let currentLightboxIndex = -1;

function initModals() {
  window.openLightbox = function(imgIndex, title, category, desc, specs) {
    currentLightboxIndex = imgIndex;
    const lightboxModal = document.getElementById('lightboxModal');
    const imgBox = document.getElementById('lightboxImgContainer');
    const titleEl = document.getElementById('lightboxTitle');
    const categoryEl = document.getElementById('lightboxCategory');
    const descEl = document.getElementById('lightboxDesc');
    const specsEl = document.getElementById('lightboxSpecs');
    const quoteBtn = document.getElementById('lightboxQuoteBtn');

    if (window.allImgTags && window.allImgTags[imgIndex]) {
      imgBox.innerHTML = window.allImgTags[imgIndex];
    }
    if (titleEl) titleEl.textContent = title;
    if (categoryEl) categoryEl.textContent = category.toUpperCase();
    if (descEl) descEl.textContent = desc;
    if (specsEl) specsEl.textContent = specs;

    if (quoteBtn) {
      quoteBtn.onclick = function() {
        closeLightbox();
        openQuoteModal(title);
      };
    }

    if (lightboxModal) {
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLightbox = function() {
    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal) lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.openQuoteModal = function(itemName) {
    const quoteModal = document.getElementById('quoteModal');
    const itemSelect = document.getElementById('quoteItemType');

    if (itemName && itemSelect) {
      for (let i = 0; i < itemSelect.options.length; i++) {
        if (itemSelect.options[i].value.toLowerCase().includes(itemName.toLowerCase())) {
          itemSelect.selectedIndex = i;
          break;
        }
      }
      const detailsEl = document.getElementById('quoteDetails');
      if (detailsEl) detailsEl.value = `Interesado en cotizar: ${itemName}. `;
    }

    if (quoteModal) {
      quoteModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeQuoteModal = function() {
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) quoteModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.handleQuoteSubmit = function(e) {
    e.preventDefault();
    const itemType = document.getElementById('quoteItemType').value;
    const material = document.getElementById('quoteMaterial').value;
    const location = document.getElementById('quoteLocation').value;
    const details = document.getElementById('quoteDetails').value;
    const clientName = document.getElementById('quoteClientName').value;

    const whatsappText = `Hola SYNTEK GROUP, mi nombre es ${encodeURIComponent(clientName)}. Deseo cotizar: %0A- *Tipo:* ${encodeURIComponent(itemType)}%0A- *Material:* ${encodeURIComponent(material)}%0A- *Ubicación:* ${encodeURIComponent(location)}%0A- *Detalles:* ${encodeURIComponent(details)}`;

    window.open(`https://wa.me/573000000000?text=${whatsappText}`, '_blank');
    closeQuoteModal();
  };

  // Close modals on Escape key or backdrop click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeQuoteModal();
    }
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeLightbox();
        closeQuoteModal();
      }
    });
  });
}

/* ==========================================================================
   6. TOUCH SWIPE & KEYBOARD GALLERY NAVIGATION
   ========================================================================== */
function initTouchGestures() {
  let touchStartX = 0;
  let touchEndX = 0;
  const lightboxModal = document.getElementById('lightboxModal');

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      navigateGallery(1); // Swipe left -> Next
    } else if (touchEndX > touchStartX + threshold) {
      navigateGallery(-1); // Swipe right -> Prev
    }
  }

  window.addEventListener('keydown', (e) => {
    const lightboxModal = document.getElementById('lightboxModal');
    if (lightboxModal && lightboxModal.classList.contains('open')) {
      if (e.key === 'ArrowRight') navigateGallery(1);
      if (e.key === 'ArrowLeft') navigateGallery(-1);
    }
  });
}

function navigateGallery(direction) {
  if (currentLightboxIndex < 0 || !window.allImgTags) return;
  let newIndex = currentLightboxIndex + direction;
  if (newIndex < 1) newIndex = window.allImgTags.length - 1; // Loop back
  if (newIndex >= window.allImgTags.length) newIndex = 1;

  // Find product card corresponding to new index
  const cards = document.querySelectorAll('.product-card');
  if (cards[newIndex]) {
    const clickHandler = cards[newIndex].querySelector('.product-img-focus');
    if (clickHandler) clickHandler.click();
  }
}

/* ==========================================================================
   7. SCROLL SPY FOR NAVIGATION HIGHLIGHTING
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
