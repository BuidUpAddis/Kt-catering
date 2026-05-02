const animatedItems = document.querySelectorAll("[data-animate]");
const counters = document.querySelectorAll(".count");
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".package-card");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".site-header nav");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

animatedItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 55, 360)}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 950;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${counter.dataset.suffix || ""}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(counter);
    });
  },
  { threshold: 0.8 }
);

counters.forEach((counter) => countObserver.observe(counter));

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filters.forEach((filter) => filter.classList.toggle("is-active", filter === button));
    cards.forEach((card) => {
      const shouldShow = selected === "all" || card.dataset.package === selected;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
