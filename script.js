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

// ── Testimonials Slider ──
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".testimonial");
  const dotsContainer = document.getElementById("testimonials-dots");
  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Testimonial ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    const dots = dotsContainer.querySelectorAll(".testimonial-dot");

    // Fade out current
    slides[current].style.opacity = "0";
    slides[current].style.pointerEvents = "none";
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = index;

    // Sync slider min-height so layout doesn't jump
    slides[current].classList.add("active");
    slides[current].style.opacity = "1";
    slides[current].style.pointerEvents = "auto";
    dots[current].classList.add("active");
  }
});

// ── GSAP Scroll Text Animation ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

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
