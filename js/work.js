// ── Work Page: Heading Entrance Animation ──
document.addEventListener("DOMContentLoaded", () => {
  const workTitle = document.querySelector(".work-page-title");
  if (!workTitle) return;

  gsap.set(workTitle, { y: 80 });
  gsap.to(workTitle, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power4.out",
    delay: 0.2,
  });
});
