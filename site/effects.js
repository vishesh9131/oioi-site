// Motion layer — Aceternity-style 3D tilt, cursor spotlight, parallax grid and
// scroll reveals. Vanilla, no deps. Everything degrades to a static page if JS
// is off or the user prefers reduced motion.
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── scroll reveal (staggered) ───────────────────────────────────────────
  // Tag the section intros, bento tiles, flow steps and download card.
  const reveals = document.querySelectorAll(
    ".sec-head, .tile, .flow li, .download-card"
  );
  if (reduced) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    reveals.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const sibs = Array.from(e.target.parentElement.children).filter((c) =>
            c.classList.contains("reveal")
          );
          const i = Math.max(0, sibs.indexOf(e.target));
          e.target.style.setProperty("--reveal-delay", Math.min(i, 6) * 0.07 + "s");
          e.target.classList.add("in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  if (reduced) return; // tilt / spotlight / parallax are pure flourish

  const hero = document.getElementById("hero");
  const spotlight = hero && hero.querySelector(".spotlight");
  const grid = hero && hero.querySelector(".grid-bg");
  const stage = hero && hero.querySelector(".stage");
  const mock = stage && stage.querySelector(".mock");

  // ── cursor spotlight + 3D tilt (rAF-batched) ────────────────────────────
  let raf = 0;
  let mx = 70, my = 0; // spotlight %  (defaults match CSS)
  let tilt = null; // {rx, ry} when pointer is over the stage

  function paint() {
    raf = 0;
    if (spotlight) spotlight.style.setProperty("--mx", mx + "%"),
      spotlight.style.setProperty("--my", my + "%");
    if (mock && tilt)
      mock.style.transform = `rotateY(${tilt.ry}deg) rotateX(${tilt.rx}deg)`;
  }
  const schedule = () => (raf || (raf = requestAnimationFrame(paint)));

  if (hero && spotlight) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      schedule();
    });
  }

  if (stage && mock) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt = { ry: px * 18, rx: -py * 14 };
      schedule();
    });
    stage.addEventListener("pointerleave", () => {
      tilt = null;
      mock.style.transform = ""; // revert to the CSS rest pose (transitions back)
    });
  }

  // ── parallax: drift the hero grid as you scroll ─────────────────────────
  if (grid) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        grid.style.transform = `translateY(${window.scrollY * 0.18}px)`;
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
  }
})();
