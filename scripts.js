// Código sencillo para gestionar menú, sliders, lightbox y validación.
window.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
  }

  // Smooth scroll para enlaces internos si hay anclas en la misma página.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  initSliders();
  initLightbox();
  initContactForm();
});

function initSliders() {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(function (slider) {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    if (!track || !slides.length) return;

    let currentIndex = 0;

    function update() {
      const offset = currentIndex * -100;
      track.style.transform = 'translateX(' + offset + '%)';
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        update();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % slides.length;
        update();
      });
    }

    // Auto rotación suave en testimonios si existe.
    if (slider.dataset.slider === 'testimonios') {
      setInterval(function () {
        currentIndex = (currentIndex + 1) % slides.length;
        update();
      }, 7000);
    }
  });
}

function initLightbox() {
  const thumbs = document.querySelectorAll('.image-thumb');
  if (!thumbs.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<div class="lightbox-content"><button class="lightbox-close" aria-label="Cerrar">×</button><img alt="Imagen ampliada"><div class="lightbox-caption"></div></div>';
  document.body.appendChild(overlay);

  const lightboxImage = overlay.querySelector('img');
  const caption = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const full = thumb.dataset.full;
      const text = thumb.querySelector('span')?.textContent || '';
      if (full) {
        lightboxImage.src = full;
        caption.textContent = text;
        overlay.classList.add('open');
      }
    });
  });

  closeBtn.addEventListener('click', function () {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      overlay.classList.remove('open');
    }
  });
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const messageEl = form.querySelector('.form-message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showMessage('Por favor completa todos los campos.', 'error');
      return;
    }

    if (!validateEmail(email.value.trim())) {
      showMessage('Escribe un correo válido.', 'error');
      return;
    }

    showMessage('Gracias por tu mensaje. Pronto recibirás respuesta.', 'success');
    form.reset();
  });

  function showMessage(text, type) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.style.color = type === 'success' ? 'green' : '#b75e34';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
