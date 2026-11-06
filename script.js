// Сообщаем CSS, что JavaScript успешно загрузился (включает безопасную анимацию)
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', function() {
  // === 1. ОБРАБОТКА ФОРМЫ ===
  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const statusEl = document.getElementById('formStatus');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      statusEl.textContent = '';
      statusEl.className = 'form__status';
      
      fetch('/assets/components/formit/handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          statusEl.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в течение 15 минут.';
          statusEl.classList.add('success');
          form.reset();
        } else {
          statusEl.textContent = result.message || 'Ошибка. Позвоните нам: +7 (922) 103-68-29';
          statusEl.classList.add('error');
        }
      })
      .catch(() => {
        statusEl.textContent = 'Ошибка сети. Позвоните нам: +7 (922) 103-68-29';
        statusEl.classList.add('error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  }

  // === 2. ШАПКА МЕНЯЕТ ФОН ПРИ СКРОЛЛЕ ===
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // === 3. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ В НАВИГАЦИИ ===
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');
  
  if (navLinks.length && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            if (link.dataset.section === id) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    
    sections.forEach(section => observer.observe(section));
  }

  // === 4. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ПРИ СКРОЛЛЕ ===
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // === 5. ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ ===
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.querySelectorAll('.nav-menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle) menuToggle.checked = false;
    });
  });
});