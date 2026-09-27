/* ============================================================
   ASAD PHARMACY — MAIN.JS
   Core site behaviour. No dependencies. Defensive/error-safe.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile navigation ----------
     Opens ONLY on explicit click/tap of the hamburger button.
     No touchstart / swipe / edge-swipe listeners are used anywhere. */
  function initMobileNav() {
    var hamburger = document.querySelector("[data-hamburger]");
    var nav = document.querySelector("[data-mobile-nav]");
    var overlay = document.querySelector("[data-mobile-overlay]");
    var closeBtn = document.querySelector("[data-mobile-close]");
    if (!hamburger || !nav || !overlay) return;

    var links = nav.querySelectorAll("a");
    var lastFocused = null;

    function openMenu() {
      lastFocused = document.activeElement;
      nav.classList.add("is-open");
      overlay.classList.add("is-open");
      document.body.classList.add("nav-open");
      hamburger.setAttribute("aria-expanded", "true");
      nav.setAttribute("aria-hidden", "false");
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      nav.classList.remove("is-open");
      overlay.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      hamburger.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
      if (lastFocused) lastFocused.focus();
    }

    hamburger.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    links.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
      }
    });

    // Basic focus trap while menu is open
    nav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusable = nav.querySelectorAll("a, button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.querySelector("[data-back-to-top]");
    if (!btn) return;
    var ticking = false;

    function update() {
      if (window.scrollY > 480) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    var items = document.querySelectorAll("[data-faq-item]");
    if (!items.length) return;

    items.forEach(function (item) {
      var q = item.querySelector("[data-faq-q]");
      var a = item.querySelector("[data-faq-a]");
      if (!q || !a) return;

      q.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        items.forEach(function (other) {
          other.classList.remove("is-open");
          var otherA = other.querySelector("[data-faq-a]");
          var otherQ = other.querySelector("[data-faq-q]");
          if (otherA) otherA.style.maxHeight = null;
          if (otherQ) otherQ.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Product filter tabs ---------- */
  function initFilters() {
    var tabs = document.querySelectorAll("[data-filter-tab]");
    var cards = document.querySelectorAll("[data-product-card]");
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var value = tab.getAttribute("data-filter-tab");

        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");

        cards.forEach(function (card) {
          var cat = card.getAttribute("data-product-card");
          var show = value === "all" || cat === value;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form validation (client-side only) ---------- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var status = form.querySelector("[data-form-status]");

    function setError(field, message) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("has-error");
      var errEl = wrap.querySelector(".field-error");
      if (errEl) errEl.textContent = message;
    }

    function clearError(field) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.remove("has-error");
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var phone = form.querySelector("#phone");
      var message = form.querySelector("#message");

      [name, email, phone, message].forEach(function (f) {
        if (f) clearError(f);
      });

      if (name && !name.value.trim()) {
        setError(name, "Please enter your full name.");
        valid = false;
      }
      if (email && !isValidEmail(email.value.trim())) {
        setError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (phone && !phone.value.trim()) {
        setError(phone, "Please enter a phone number.");
        valid = false;
      }
      if (message && message.value.trim().length < 8) {
        setError(message, "Please enter a short message so we can help.");
        valid = false;
      }

      if (!valid) {
        if (status) {
          status.textContent = "Please correct the fields highlighted above.";
          status.classList.add("is-visible");
        }
        return;
      }

      // Static website — no backend is connected yet.
      // Ready for future email/backend integration.
      if (status) {
        status.textContent = "Thank you. This form is not yet connected to a live inbox — please call 0321 4237621 or email asadpharmacy1@gmail.com and we will respond directly.";
        status.classList.add("is-visible");
      }
      form.reset();
    });
  }

  /* ---------- Active nav link highlight (defensive fallback) ---------- */
  function markActiveNav() {
    try {
      var path = window.location.pathname.split("/").pop() || "index.html";
      document.querySelectorAll("[data-nav-link]").forEach(function (link) {
        var href = link.getAttribute("href");
        if (href === path) {
          link.setAttribute("aria-current", "page");
        }
      });
    } catch (err) {
      /* no-op */
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initBackToTop();
    initFaq();
    initFilters();
    initContactForm();
    markActiveNav();
  });
})();
      
