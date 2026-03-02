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


  // ── Testimonials Mobile Carousel ──
  const tTrack = document.getElementById("t-track");
  const tCards = document.querySelectorAll(".t-card");
  const tPrev  = document.querySelector(".t-prev");
  const tNext  = document.querySelector(".t-next");
  let   tIdx   = 0;

  function tSlideTo(idx) {
    tIdx = ((idx % tCards.length) + tCards.length) % tCards.length;
    const cardW = tCards[0].offsetWidth;
    tTrack.style.transform = `translateX(-${tIdx * cardW}px)`;
  }

  tPrev.addEventListener("click", () => tSlideTo(tIdx - 1));
  tNext.addEventListener("click", () => tSlideTo(tIdx + 1));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      tTrack.style.transform = "";
    } else {
      // re-snap to current card after resize
      tSlideTo(tIdx);
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
