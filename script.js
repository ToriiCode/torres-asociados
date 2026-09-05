/* =====================================================
   Torres & Asociados - script.js
   ===================================================== */

(function () {
  "use strict";

  /* ── 1. Navbar Scroll (Glassmorphism) ─────────────── */
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Auto-hide on scroll down / show on scroll up (optional UX)
    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }

  navbar.style.transition =
    "transform 0.4s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease";
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ── 2. Menú Hamburguesa Mobile ────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ── 3. Active Nav Link (highlight current page) ──── */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ── 4. Scroll Reveal Animation ───────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ── 5. Staggered Delay for Card Grids ────────────── */
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    grid.querySelectorAll(".reveal").forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  /* ── 6. Counter Animation (Stats Strip) ───────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || "");
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-target]").forEach((el) =>
    counterObserver.observe(el)
  );

  /* ── 7. Contact Form Handling ─────────────────────── */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Basic validation
      const required = contactForm.querySelectorAll("[required]");
      let valid = true;
      required.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#EF4444";
          valid = false;
        } else {
          field.style.borderColor = "";
        }
      });

      if (!valid) {
        showToast("Por favor complete todos los campos obligatorios.", "error");
        return;
      }

      // Simulated submit
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check mr-2"></i>Mensaje Enviado';
        btn.style.background = "#16A34A";
        showToast("Su consulta ha sido enviada. Le contactaremos a la brevedad.", "success");

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = "";
          btn.disabled = false;
          contactForm.reset();
        }, 3500);
      }, 1800);
    });
  }

  /* ── 8. Toast Notification ────────────────────────── */
  function showToast(message, type = "success") {
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    const color = type === "success" ? "#D4AF37" : "#EF4444";
    const icon  = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    toast.style.cssText = `
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      display: flex; align-items: center; gap: .75rem;
      padding: 1rem 1.5rem;
      background: #1E293B;
      border-left: 4px solid ${color};
      border-radius: 4px;
      color: #F8FAFC; font-size: .9rem;
      box-shadow: 0 20px 40px rgba(0,0,0,.5);
      animation: slideInRight .4s ease;
      max-width: 360px;
    `;

    toast.innerHTML = `<i class="fas ${icon}" style="color:${color};font-size:1.1rem"></i><span>${message}</span>`;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(120%); opacity: 0; }
        to   { transform: translateX(0);   opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity .4s, transform .4s";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(120%)";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

})();
