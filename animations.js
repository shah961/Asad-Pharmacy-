/* ============================================================
   ASAD PHARMACY — ANIMATIONS.JS
   Subtle, restrained motion. Respects prefers-reduced-motion.
   Uses GSAP if loaded; otherwise falls back to CSS classes.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal for sections/cards ---------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- One orchestrated hero entrance ---------- */
  function initHeroEntrance() {
    var hero = document.querySelector("[data-hero-animate]");
    if (!hero || reduceMotion) return;

    var pieces = hero.querySelectorAll("[data-hero-piece]");
    if (!pieces.length) return;

    try {
      if (window.gsap) {
        window.gsap.set(pieces, { opacity: 0, y: 16 });
        window.gsap.to(pieces, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          delay: 0.1
        });
      } else {
        pieces.forEach(function (el, i) {
          el.style.opacity = "0";
          el.style.transform = "translateY(16px)";
          setTimeout(function () {
            el.style.transition = "opacity .6s ease, transform .6s ease";
            el.style.opacity = "1";
            el.style.transform = "none";
          }, 100 + i * 110);
        });
      }
    } catch (err) {
      pieces.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  /* ---------- Pause hero visual animation when off-screen ---------- */
  function pauseOffscreenVisual() {
    var visual = document.querySelector("[data-hero-visual]");
    if (!visual || typeof IntersectionObserver === "undefined") return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visual.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        visual.querySelectorAll("*").forEach(function (child) {
          child.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        });
      });
    }, { threshold: 0 });

    observer.observe(visual);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initScrollReveal();
    initHeroEntrance();
    pauseOffscreenVisual();
  });
})();
