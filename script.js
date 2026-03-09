// ─────────────────────────────────────────────
// PAGE TRANSITION COVER COLORS
// Set the color of the slide cover when leaving each page.
// Values can be CSS variables (e.g. "var(--clr-dark)") or any CSS color.
// ─────────────────────────────────────────────
const TRANSITION_COLORS = {
  "index.html": "var(--clr-dark)",   // leaving Home
  "work.html":  "var(--clr-bg)",     // leaving My Work
  "about.html": "var(--clr-bg)",     // leaving About
};
// Fallback color if the page isn't listed above
const TRANSITION_COLOR_DEFAULT = "var(--clr-dark)";
// ─────────────────────────────────────────────

// ── Mobile Menu Toggle ──
const hamburger = document.getElementById("nav-hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.contains("open");
  if (isOpen) {
    closeMobileMenu();
  } else {
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => mobileMenu.classList.add("visible"));
  }
});

function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("visible");
  document.body.style.overflow = "";
  mobileMenu.addEventListener("transitionend", () => {
    mobileMenu.classList.remove("open");
  }, { once: true });
}

// ── Nav Scroll State ──
const nav = document.getElementById("main-nav");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

// ── Clear cover on back/forward navigation (bfcache restore) ──
window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    const cover = document.getElementById("page-cover");
    if (cover) gsap.set(cover, { yPercent: -100 });
  }
});

// ── Main Init ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Page Transition Cover ──
  const cover = document.createElement("div");
  cover.id = "page-cover";
  document.body.appendChild(cover);

  if (!document.getElementById("loader")) {
    if (document.querySelector(".work-page-title")) {
      // Work page: hide cover immediately, work.js handles heading animation
      gsap.set(cover, { yPercent: -100 });
    } else {
      // Other pages without loader: slide cover up to reveal content
      gsap.fromTo(cover,
        { yPercent: 0 },
        { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.05 }
      );
    }
  } else {
    // index.html: loader already handles entrance, hide cover immediately
    gsap.set(cover, { yPercent: -100 });
  }

  // ── Exit animation: slide cover in from bottom, then navigate ──
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto") &&
      !href.startsWith("http") &&
      !href.startsWith("//")
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        if (href === currentPage || href.split("#")[0] === currentPage) return;
        if (href.startsWith("index.html")) {
          window.location.href = href;
          return;
        }
        const fromPage = window.location.pathname.split("/").pop() || "index.html";
        cover.style.background = TRANSITION_COLORS[fromPage] ?? TRANSITION_COLOR_DEFAULT;
        gsap.fromTo(cover,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.65,
            ease: "expo.inOut",
            onComplete: () => { sessionStorage.setItem("page-transition", "1"); window.location.href = href; },
          }
        );
      });
    }
  });

  // ── Lenis smooth scroll ──
  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ── Scroll Section Reveals ──
  gsap.utils.toArray(".work, .about, .testimonials, footer").forEach((el) => {
    gsap.set(el, { opacity: 0, y: 60 });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out",
    });
  });

  // ── Project Image — bottom to top reveal ──
  gsap.utils.toArray(".slide-media").forEach((media) => {
    gsap.fromTo(media,
      { clipPath: "inset(100% 0 0% 0)" },
      {
        clipPath: "inset(0% 0 0% 0)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: media.closest(".work-item"),
          start: "top 80%",
          once: true,
        },
      }
    );
  });

  // ── Work Video Hover ──
  document.querySelectorAll(".slide-media").forEach((media) => {
    const video = media.querySelector(".slide-video");
    if (!video) return;
    media.addEventListener("mouseenter", () => video.play().catch(() => { }));
    media.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ── GSAP Scroll Text Animation ──
  document.querySelectorAll(".animate").forEach((textElement) => {
    const text = textElement.textContent;
    textElement.innerHTML = text
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    const chars = textElement.querySelectorAll("span");
    gsap.from(chars, {
      scrollTrigger: {
        trigger: textElement,
        start: "top 85%",
        end: "top 20%",
        scrub: 0.6,
      },
      color: "#B1AFAF",
      opacity: 0.3,
      stagger: 0.03,
      ease: "none",
    });
  });

  // ── Index Page: Loader, Hero, Testimonials ──
  const loaderEl = document.getElementById("loader");
  if (loaderEl) {
    const loaderNumEl = document.getElementById("loader-num");
    const loaderBarEl = document.querySelector(".loader-bar");

    gsap.set(".hero", { opacity: 0, y: 40 });

    gsap.to({ val: 0 }, {
      val: 100,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: function () {
        const v = Math.floor(this.targets()[0].val);
        loaderNumEl.textContent = v;
        loaderBarEl.style.width = v + "%";
      },
      onComplete: () => {
        loaderNumEl.textContent = "100";
        loaderBarEl.style.width = "100%";

        gsap.to(loaderEl, {
          yPercent: -100,
          duration: 0.85,
          ease: "expo.inOut",
          delay: 0.1,
          onComplete: () => loaderEl.remove(),
        });

        gsap.to(".hero", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.35,
        });

        gsap.from(".hero-line", {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.14,
          delay: 0.5,
        });
      },
    });

    // ── Testimonials Infinite Transform Slider ──
    const tViewport = document.getElementById("t-viewport");
    const tTrackEl = document.getElementById("t-track");
    const realCards = Array.from(document.querySelectorAll(".t-card"));
    const tPrev = document.getElementById("t-prev");
    const tNext = document.getElementById("t-next");

    realCards.forEach(card => {
      const c = card.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      tTrackEl.appendChild(c);
    });
    realCards.forEach(card => {
      const c = card.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      tTrackEl.prepend(c);
    });

    function setCardWidths() {
      const gap = parseFloat(getComputedStyle(tTrackEl).gap) || 16;
      const cols = window.innerWidth <= 1024 ? 2 : 3;
      const w = Math.floor((tViewport.offsetWidth - (cols - 1) * gap) / cols);
      tTrackEl.querySelectorAll(".t-card").forEach(c => { c.style.width = w + "px"; });
    }
    setCardWidths();

    function stride() {
      const gap = parseFloat(getComputedStyle(tTrackEl).gap) || 16;
      return realCards[0].offsetWidth + gap;
    }
    function sw() { return realCards.length * stride(); }

    let xPos = -sw();
    gsap.set(tTrackEl, { x: xPos });

    window.addEventListener("resize", () => {
      setCardWidths();
      xPos = -sw();
      gsap.set(tTrackEl, { x: xPos });
    });

    let isAnimating = false;
    let isDragging = false;
    let dragStartPageX = 0;
    let dragStartX = 0;

    function normalizeX() {
      const S = sw();
      if (xPos <= -2 * S) xPos += S;
      else if (xPos > -S) xPos -= S;
      gsap.set(tTrackEl, { x: xPos });
    }

    function slide(dir) {
      if (isAnimating) return;
      isAnimating = true;
      xPos += dir * stride();
      gsap.to(tTrackEl, {
        x: xPos,
        duration: 0.75,
        ease: "expo.out",
        onComplete: () => { normalizeX(); isAnimating = false; },
      });
    }

    function pulseArrow(btn) {
      gsap.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    }

    tPrev.addEventListener("click", () => { slide(1); pulseArrow(tPrev); });
    tNext.addEventListener("click", () => { slide(-1); pulseArrow(tNext); });

    // Mouse drag
    tViewport.addEventListener("mousedown", (e) => {
      if (isAnimating) return;
      isDragging = true;
      dragStartX = xPos;
      dragStartPageX = e.pageX;
      tViewport.classList.add("is-grabbing");
      gsap.killTweensOf(tTrackEl);
      e.preventDefault();
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      tViewport.classList.remove("is-grabbing");
      snapAfterDrag();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      xPos = dragStartX + (e.pageX - dragStartPageX);
      gsap.set(tTrackEl, { x: xPos });
    });

    // Touch drag
    tViewport.addEventListener("touchstart", (e) => {
      if (isAnimating) return;
      isDragging = true;
      dragStartX = xPos;
      dragStartPageX = e.touches[0].pageX;
      tViewport.classList.add("is-grabbing");
      gsap.killTweensOf(tTrackEl);
    }, { passive: true });

    tViewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      xPos = dragStartX + (e.touches[0].pageX - dragStartPageX);
      gsap.set(tTrackEl, { x: xPos });
    }, { passive: true });

    tViewport.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      tViewport.classList.remove("is-grabbing");
      snapAfterDrag();
    });

    function snapAfterDrag() {
      const S = sw();
      const s = stride();
      while (xPos <= -2 * S) xPos += S;
      while (xPos > -S) xPos -= S;
      const idx = Math.max(0, Math.min(realCards.length - 1, Math.round((-xPos - S) / s)));
      xPos = -S - idx * s;
      isAnimating = true;
      gsap.to(tTrackEl, {
        x: xPos,
        duration: 0.55,
        ease: "expo.out",
        onComplete: () => { isAnimating = false; },
      });
    }
  }
});
