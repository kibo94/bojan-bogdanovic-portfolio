// ── RTT Project Page Animations ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero title entrance ──
  gsap.to("#rtt-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.25,
  });

  // ── Full-width screenshot reveal ──
  gsap.to(".rtt-fullshot-img", {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.4,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: ".rtt-fullshot-wrap",
      start: "top 82%",
      once: true,
    },
  });

  // ── Comparison images reveal ──
  ["#rtt-old-img .rtt-compare-img", "#rtt-new-img .rtt-compare-img"].forEach((sel, i) => {
    gsap.to(sel, {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.1,
      ease: "power3.inOut",
      delay: i * 0.12,
      scrollTrigger: {
        trigger: ".rtt-compare-grid",
        start: "top 80%",
        once: true,
      },
    });
  });

  // ── Gallery images reveal ──
  ["#rtt-gal-1", "#rtt-gal-2", "#rtt-gal-3"].forEach((sel, i) => {
    gsap.to(sel + " .rtt-gallery-img", {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.0,
      ease: "power3.inOut",
      delay: i * 0.1,
      scrollTrigger: {
        trigger: ".rtt-gallery-grid",
        start: "top 85%",
        once: true,
      },
    });
  });

  // ── Section fade-up reveals ──
  gsap.utils.toArray(".rtt-overview, .rtt-compare, .rtt-gallery, footer").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
});
