document.addEventListener("DOMContentLoaded", () => {
  // ── Hero entrance ──
  gsap.from(".ab-hero-title", {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 0.3,
  });

  gsap.from(".ab-hero-bio p", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    delay: 0.5,
  });

  gsap.from(".ab-hero-photo img", {
    scale: 1.06,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.1,
  });

  // ── Photos heading scroll reveal ──
  gsap.from(".ab-photos-title", {
    scrollTrigger: {
      trigger: ".ab-photos-heading",
      start: "top 80%",
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
  });

  gsap.from(".ab-photos-desc p", {
    scrollTrigger: {
      trigger: ".ab-photos-desc",
      start: "top 85%",
    },
    y: 30,
    opacity: 0,
    duration: 0.75,
    stagger: 0.15,
    ease: "power3.out",
  });

  // ── Grid items reveal ──
  document.querySelectorAll(".ab-grid-item").forEach((item) => {
    gsap.fromTo(
      item,
      { clipPath: "inset(100% 0 0% 0)" },
      {
        clipPath: "inset(0% 0 0% 0)",
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          once: true,
        },
      }
    );
  });
});
