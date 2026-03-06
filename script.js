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

// ── Main Init ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Lenis smooth scroll ──
  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const loaderEl = document.getElementById("loader");
  const loaderNumEl = document.getElementById("loader-num");
  const loaderBarEl = document.querySelector(".loader-bar");

  // ── Loading Counter ──
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

      // Slide loader up
      gsap.to(loaderEl, {
        yPercent: -100,
        duration: 0.85,
        ease: "expo.inOut",
        delay: 0.1,
        onComplete: () => loaderEl.remove(),
      });

      // Reveal hero
      gsap.to(".hero", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.35,
      });

      // Animate heading lines up row by row
      gsap.from(".hero-line", {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.14,
        delay: 0.5,
      });
    },
  });

  // Set hero start state for reveal
  gsap.set(".hero", { opacity: 0, y: 40 });

  // ── Scroll Section Reveals ──
  gsap.utils.toArray(".work, .about, .testimonials, footer").forEach((el) => {
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
    gsap.set(el, { opacity: 0, y: 60 });
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

  // ── Testimonials Infinite Draggable Slider ──
  const tViewport = document.getElementById("t-viewport");
  const tTrackEl = document.getElementById("t-track");
  const realCards = Array.from(document.querySelectorAll(".t-card"));
  const tDots = document.querySelectorAll(".t-dot");

  // Clone cards before and after originals for infinite loop
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

  // Start scrolled to the original set (past the prepended clones)
  tViewport.scrollLeft = getSetWidth();

  // ── Mouse drag ──
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

  // ── Mouse drag ──
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

  // ── Touch drag ──
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

  // ── Dot click → scroll to original card ──
  tDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = parseInt(dot.dataset.idx);
      const target = getSetWidth() + idx * cardStride();
      tViewport.scrollTo({ left: target, behavior: "smooth" });
    });
  });

  // ── Sync dots to current position ──
  function syncDots() {
    const sw = getSetWidth();
    let sl = tViewport.scrollLeft;
    // Normalize to original-set range
    if (sl < sw) sl += sw;
    if (sl >= sw * 2) sl -= sw;
    const idx = Math.min(Math.floor((sl - sw) / cardStride()), realCards.length - 1);
    tDots.forEach((dot, i) => dot.classList.toggle("t-dot--active", i === idx));
  }

  // ── Infinite reset on scroll end (not during drag) ──
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

  // ── GSAP Scroll Text Animation ──
  const textElements = document.querySelectorAll(".animate");
  textElements.forEach((textElement) => {
    const text = textElement.textContent;
    textElement.innerHTML = text
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    const chars = textElement.querySelectorAll("span");
    gsap.from(chars, {
      scrollTrigger: {
        trigger: textElement,
        start: "top 80%",
        end: "bottom 40%",
        scrub: 1.5,
      },
      color: "#B1AFAF",
      stagger: 0.05,
      ease: "none",
    });
  });
});
