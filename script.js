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

// ── Main Init ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const loaderEl    = document.getElementById("loader");
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

  // ── Testimonials Slider ──
  const slides       = document.querySelectorAll(".testimonial");
  const dotsContainer = document.getElementById("testimonials-dots");
  const sliderEl     = document.getElementById("testimonials-slider");
  let current = 0;
  let autoTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
    dot.addEventListener("click", () => { goTo(i); resetAutoplay(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    const dots = dotsContainer.querySelectorAll(".testimonial-dot");
    slides[current].style.opacity = "0";
    slides[current].style.pointerEvents = "none";
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add("active");
    slides[current].style.opacity = "1";
    slides[current].style.pointerEvents = "auto";
    dots[current].classList.add("active");
  }

  function startAutoplay() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoTimer);
    startAutoplay();
  }

  startAutoplay();

  // Pause on hover
  sliderEl.addEventListener("mouseenter", () => clearInterval(autoTimer));
  sliderEl.addEventListener("mouseleave", () => { clearInterval(autoTimer); startAutoplay(); });

  // Mouse drag
  let dragStartX = 0;
  let dragging = false;

  sliderEl.addEventListener("mousedown", (e) => {
    dragStartX = e.clientX;
    dragging = true;
  });
  sliderEl.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
  });
  sliderEl.addEventListener("mouseleave", () => { dragging = false; });

  // Touch swipe
  sliderEl.addEventListener("touchstart", (e) => {
    dragStartX = e.touches[0].clientX;
  }, { passive: true });
  sliderEl.addEventListener("touchend", (e) => {
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
  });

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
        start: "top 85%",
        end: "bottom 20%",
        scrub: true,
      },
      color: "green",
      stagger: 1,
      duration: 1,
    });
  });
});
