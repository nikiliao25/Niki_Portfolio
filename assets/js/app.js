/* =================================================================
   Niki Liao — Portfolio interactions
   Vanilla JS, no dependencies.
   ================================================================= */
(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "nl-theme";

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.setAttribute("data-theme", "light");
  }
  syncThemeColor();

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    syncThemeColor();
  });

  function syncThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        root.getAttribute("data-theme") === "light" ? "#faf7f1" : "#14110b"
      );
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("header");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 12);
    toTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll-spy active nav ---------- */
  const sections = ["about", "experience", "projects", "skills", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  const linkMap = {};
  navLinks.querySelectorAll("a").forEach(function (a) {
    linkMap[a.getAttribute("href").slice(1)] = a;
  });

  const spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.values(linkMap).forEach(function (l) { l.classList.remove("active"); });
          const active = linkMap[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || (i % 3) * 80;
            setTimeout(function () { entry.target.classList.add("in"); }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Project filtering ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      const filter = btn.dataset.filter;

      cards.forEach(function (card) {
        const tags = (card.dataset.tags || "").split(" ");
        const show = filter === "all" || tags.indexOf(filter) !== -1;
        card.style.display = show ? "" : "none";
      });
    });
  });

  /* ---------- Contact form ----------
     Works with Formspree (or any POST endpoint that accepts JSON/form data).
     1. Create a free form at https://formspree.io
     2. Replace FORM_ENDPOINT below with your endpoint, e.g.
        "https://formspree.io/f/abcdwxyz"
     If left as null, the form falls back to opening the user's mail client.
  ------------------------------------------------------------------ */
  const FORM_ENDPOINT = null; // e.g. "https://formspree.io/f/yourid"

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("cfSubmit");
  const submitLabel = submitBtn.querySelector(".btn-label");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      subject: form.elements["subject"].value.trim(),
      message: form.elements["message"].value.trim(),
    };

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      showStatus("error", "Please fill in your name, email, and a message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showStatus("error", "That email address doesn't look right.");
      return;
    }

    if (!FORM_ENDPOINT) {
      // Graceful fallback: open mail client pre-filled.
      const subject = encodeURIComponent(data.subject || "Portfolio inquiry from " + data.name);
      const body = encodeURIComponent(data.message + "\n\n— " + data.name + " (" + data.email + ")");
      window.location.href = "mailto:nikiliao25@gmail.com?subject=" + subject + "&body=" + body;
      showStatus("success", "Opening your email app… if nothing happens, email nikiliao25@gmail.com directly.");
      return;
    }

    setLoading(true);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus("success", "Thanks, " + data.name.split(" ")[0] + "! Your message is on its way.");
        } else {
          showStatus("error", "Something went wrong. Please email nikiliao25@gmail.com instead.");
        }
      })
      .catch(function () {
        showStatus("error", "Network error. Please email nikiliao25@gmail.com instead.");
      })
      .finally(function () { setLoading(false); });
  });

  function showStatus(type, msg) {
    status.className = "form-status " + type;
    status.textContent = msg;
  }
  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.style.opacity = loading ? "0.7" : "";
    submitLabel.textContent = loading ? "Sending…" : "Send message";
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
