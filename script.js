(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primaryNav");
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  function setMenu(open) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("is-open", open);
  }

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  navLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  const doorDialog = document.querySelector("#doorDialog");
  const doorTitle = document.querySelector("#doorDialogTitle");
  const doorIntro = document.querySelector("#doorDialogIntro");
  const certificateList = document.querySelector("#certificateList");
  document.querySelectorAll(".door-card").forEach(door => {
    door.addEventListener("click", () => {
      const isCertificatesDoor = door.dataset.door === "Certificates";
      if (doorTitle) doorTitle.textContent = door.dataset.door || "Inside the door";
      if (doorIntro) {
        doorIntro.textContent = isCertificatesDoor
          ? "A growing collection of things I’ve learned, explored and completed."
          : "I’ll add this part when you share what you’d like to show here.";
      }
      if (certificateList) certificateList.hidden = !isCertificatesDoor;
      doorDialog?.showModal();
    });
  });
  document.querySelector(".dialog-done")?.addEventListener("click", () => doorDialog?.close());
  doorDialog?.addEventListener("click", event => {
    if (event.target === doorDialog) doorDialog.close();
  });

  const filters = [...document.querySelectorAll(".filter-button")];
  const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
  const projectStatus = document.querySelector("#projectStatus");
  filters.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visible = 0;
      projectCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      if (projectStatus) projectStatus.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}`;
    });
  });

  const form = document.querySelector("#contactForm");
  const formStatus = document.querySelector("#formStatus");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject = String(values.get("subject") || "Portfolio enquiry");
    const body = [
      `Name: ${values.get("name")}`,
      `Email: ${values.get("email")}`,
      "",
      String(values.get("message") || "")
    ].join("\n");
    if (formStatus) formStatus.textContent = "Opening your email app…";
    window.location.href = `mailto:arpandebnath6779@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach((element, index) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1, y: 0, duration: 0.72, delay: Math.min((index % 4) * 0.06, 0.18),
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true }
        }
      );
    });
  }

  if ("IntersectionObserver" in window) {
    const sections = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const active = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
        navLinks.forEach(link => link.classList.toggle("is-current", link === active));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }
})();