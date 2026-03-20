// ── Tri Lepe Project Page Animations ──
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero title entrance ──
  gsap.to("#tl-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.25,
  });

  // ── Full-width screenshot reveal ──
  gsap.to(".tl-fullshot-img", {
    clipPath: "inset(0% 0 0 0)",
    duration: 1.4,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: ".tl-fullshot-wrap",
      start: "top 82%",
      once: true,
    },
  });

  // ── Feature items stagger reveal ──
  gsap.utils.toArray(".tl-feature-item").forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      delay: (i % 2) * 0.1,
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        once: true,
      },
    });
  });

  // ── Screen items reveal (each triggers independently) ──
  gsap.utils.toArray(".tl-screen-item").forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        once: true,
      },
    });
  });

  // ── Why items stagger reveal ──
  gsap.utils.toArray(".tl-why-item").forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: i * 0.06,
      scrollTrigger: {
        trigger: item,
        start: "top 92%",
        once: true,
      },
    });
  });

});
