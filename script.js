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

    // ── Testimonials Infinite Draggable Slider ──
    const tViewport = document.getElementById("t-viewport");
    const tTrackEl = document.getElementById("t-track");
    const realCards = Array.from(document.querySelectorAll(".t-card"));
    const tDots = document.querySelectorAll(".t-dot");

    realCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      tTrackEl.appendChild(clone);
    });
    realCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      tTrackEl.prepend(clone);
    });

    function cardStride() {
      const gap = parseFloat(getComputedStyle(tTrackEl).gap) || 16;
      return realCards[0].offsetWidth + gap;
    }

    function getSetWidth() {
      return realCards.length * cardStride();
    }

    tViewport.scrollLeft = getSetWidth();

    let isDragging = false;
    let dragStartX = 0;
    let dragScrollLeft = 0;

    function snapToNearest() {
      const sw = getSetWidth();
      const stride = cardStride();
      const delta = tViewport.scrollLeft - dragScrollLeft;
      const threshold = stride * 0.2;

      let normStart = dragScrollLeft;
      if (normStart >= sw * 2) normStart -= sw;
      else if (normStart < sw) normStart += sw;
      const startIdx = Math.round((normStart - sw) / stride);

      let targetIdx = startIdx;
      if (delta > threshold) targetIdx = startIdx + 1;
      else if (delta < -threshold) targetIdx = startIdx - 1;

      const targetScroll = sw + targetIdx * stride;

      gsap.to(tViewport, {
        scrollLeft: targetScroll,
        duration: 0.6,
        ease: "expo.out",
        onComplete: () => {
          if (tViewport.scrollLeft >= sw * 2) tViewport.scrollLeft -= sw;
          else if (tViewport.scrollLeft < 1) tViewport.scrollLeft += sw;
          tViewport.classList.remove("is-grabbing");
          syncDots();
        },
      });
    }

    tViewport.addEventListener("mousedown", (e) => {
      isDragging = true;
      dragStartX = e.pageX - tViewport.offsetLeft;
      dragScrollLeft = tViewport.scrollLeft;
      tViewport.classList.add("is-grabbing");
      e.preventDefault();
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      snapToNearest();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const x = e.pageX - tViewport.offsetLeft;
      const walk = (x - dragStartX) * 1.4;
      tViewport.scrollLeft = dragScrollLeft - walk;
    });

    tViewport.addEventListener("touchstart", (e) => {
      isDragging = true;
      dragStartX = e.touches[0].pageX - tViewport.offsetLeft;
      dragScrollLeft = tViewport.scrollLeft;
      tViewport.classList.add("is-grabbing");
    }, { passive: true });

    tViewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - tViewport.offsetLeft;
      const walk = (x - dragStartX) * 1.4;
      tViewport.scrollLeft = dragScrollLeft - walk;
    }, { passive: true });

    tViewport.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      snapToNearest();
    });

    tDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.dataset.idx);
        const target = getSetWidth() + idx * cardStride();
        tViewport.scrollTo({ left: target, behavior: "smooth" });
      });
    });

    function syncDots() {
      const sw = getSetWidth();
      let sl = tViewport.scrollLeft;
      if (sl < sw) sl += sw;
      if (sl >= sw * 2) sl -= sw;
      const idx = Math.min(Math.floor((sl - sw) / cardStride()), realCards.length - 1);
      tDots.forEach((dot, i) => dot.classList.toggle("t-dot--active", i === idx));
    }

    let isResetting = false;
    tViewport.addEventListener("scroll", () => {
      if (isDragging || isResetting) return;
      syncDots();
      const sw = getSetWidth();
      if (tViewport.scrollLeft >= sw * 2) {
        isResetting = true;
        tViewport.scrollLeft -= sw;
        isResetting = false;
      } else if (tViewport.scrollLeft < 1) {
        isResetting = true;
        tViewport.scrollLeft += sw;
        isResetting = false;
      }
    }, { passive: true });
  }
});
