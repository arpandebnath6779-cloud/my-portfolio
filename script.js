/* ====== EDIT THIS SECTION ====== */
const EMAIL = "your.email@example.com"; // [YOUR_EMAIL]

// Sample content: replace with your real projects.
const PROJECTS = [
  { title: "[PROJECT 1] Arduino heart-rate monitor", category: "Biomedical",
    description: "Sample: pulse sensor with Arduino and live BPM display.",
    tags: ["Arduino", "C", "Sensors"], image: "", github: "#", demo: "#",
    details: { problem: "[Describe the problem you wanted to solve.]", hardware: "[Arduino Uno, pulse sensor, OLED…]", outcome: "[What worked and what you learned.]", code: "// paste a short code snippet here\nvoid setup(){ Serial.begin(9600); }" } },
  { title: "[PROJECT 2] IoT environment node", category: "IoT",
    description: "Sample: sensor node that sends readings to a dashboard.",
    tags: ["IoT", "Python", "Wi-Fi"], image: "", github: "#", demo: "#",
    details: { problem: "[Problem statement]", hardware: "[Components]", outcome: "[Outcome]", code: "# paste a short snippet\nprint('hello')" } },
  { title: "[PROJECT 3] C sensor data logger", category: "Embedded",
    description: "Sample: firmware in C that logs sensor data.",
    tags: ["C", "Embedded"], image: "", github: "#", demo: "#",
    details: { problem: "[Problem statement]", hardware: "[Components]", outcome: "[Outcome]", code: "/* snippet */" } },
  { title: "[PROJECT 4] Python biosignal plotter", category: "Software",
    description: "Sample: Python tool to plot and analyse biosignals.",
    tags: ["Python", "Signals"], image: "", github: "#", demo: "#",
    details: { problem: "[Problem statement]", hardware: "[Tools]", outcome: "[Outcome]", code: "# snippet" } }
];

// Sample content: replace with your real certificates.
const CERTIFICATES = [
  { title: "[REPLACE WITH REAL CERTIFICATE] Course name", issuer: "[Issuer]", date: "[Month Year]", category: "Courses", image: "", url: "#" },
  { title: "[REPLACE WITH REAL CERTIFICATE] Workshop name", issuer: "[Issuer]", date: "[Month Year]", category: "Workshops", image: "", url: "#" },
  { title: "[REPLACE WITH REAL CERTIFICATE] Competition", issuer: "[Issuer]", date: "[Month Year]", category: "Competitions", image: "", url: "#" },
  { title: "[REPLACE WITH REAL CERTIFICATE] Internship", issuer: "[Issuer]", date: "[Month Year]", category: "Internships", image: "", url: "#" }
];

const SKILLS = [["C", 80], ["Python", 80], ["Arduino", 85]]; // [PROFICIENCY %]: set your own
const STACK = ["C", "Python", "Arduino", "Embedded Systems", "IoT", "Sensors", "Circuit Design", "Biosignal Processing"];
/* ====== END EDIT SECTION ====== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Preloader */
(function () {
  const out = $("#loadCount"), btn = $("#enterBtn"), loader = $("#loader");
  let n = 0;
  const t = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 6));
    out.textContent = n + "%";
    if (n >= 100) { clearInterval(t); btn.hidden = false; btn.focus(); }
  }, 60);
  btn.addEventListener("click", () => { loader.classList.add("done"); document.body.style.overflow = ""; });
  document.body.style.overflow = "hidden";
})();

/* Live clock (Asia/Kolkata) */
function tick() {
  const d = new Date(), tz = { timeZone: "Asia/Kolkata" };
  const time = d.toLocaleTimeString("en-IN", { ...tz, hour: "numeric", minute: "2-digit", hour12: true }).replace(" ", "").toLowerCase();
  const date = d.toLocaleDateString("en-GB", { ...tz, day: "numeric", month: "long" });
  $("#clock").textContent = `${time} • ${date}`;
  $("#clock2").textContent = `Local time ${time}`;
}
tick(); setInterval(tick, 1000);

/* Modal helper */
let lastFocus = null;
function openModal(el) {
  lastFocus = document.activeElement; el.hidden = false;
  (el.querySelector("input,.close") || el).focus();
}
function closeModals() {
  $$(".modal").forEach(m => m.hidden = true);
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModals(); closeMenu(); }
  if (!$("#lightbox").hidden) { if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); }
  if (e.key === "Tab") {
    const m = $$(".modal").find(x => !x.hidden) || (!$("#menu").hidden && $("#menu"));
    if (!m) return;
    const f = $$("a[href],button,input,textarea", m).filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
$$(".modal").forEach(m => m.addEventListener("click", e => { if (e.target === m || e.target.hasAttribute("data-close")) closeModals(); }));
$$("[data-open]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal($("#" + b.dataset.open)); }));

/* Menu */
const menu = $("#menu"), menuBtn = $("#menuBtn");
function openMenu() { menu.hidden = false; menuBtn.setAttribute("aria-expanded", "true"); $("#menuClose").focus(); }
function closeMenu() { if (menu.hidden) return; menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
menuBtn.addEventListener("click", openMenu);
$("#menuClose").addEventListener("click", closeMenu);
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }));

/* Rotating words */
(function () {
  const words = ["Embedded systems", "IoT", "Biomedical devices", "Arduino", "C & Python"];
  const swap = ["IoT", "embedded", "hardware", "biomedical"];
  let i = 0, j = 0;
  setInterval(() => { i = (i + 1) % words.length; $("#rotor").textContent = words[i]; }, 2200);
  setInterval(() => { j = (j + 1) % swap.length; $("#swap").textContent = swap[j]; }, 2600);
})();

/* Tilt card */
(function () {
  const c = $("#idCard"); if (!c) return;
  const move = (x, y) => {
    const r = c.getBoundingClientRect(), px = (x - r.left) / r.width, py = (y - r.top) / r.height;
    c.style.transform = `rotateY(${(px - .5) * 24}deg) rotateX(${(.5 - py) * 24}deg)`;
    c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
  };
  c.parentElement.addEventListener("mousemove", e => move(e.clientX, e.clientY));
  c.parentElement.addEventListener("mouseleave", () => c.style.transform = "");
  window.addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    c.style.transform = `rotateY(${Math.max(-20, Math.min(20, e.gamma / 2))}deg) rotateX(${Math.max(-20, Math.min(20, (e.beta - 45) / -2))}deg)`;
  });
})();

/* Doors (tap to open on touch) */
$$(".door").forEach(d => d.addEventListener("click", () => d.classList.toggle("open")));

/* Marquee + skills */
$("#track").innerHTML = [...STACK, ...STACK].map(s => `<span>${esc(s)}</span>`).join("");
$("#skills").innerHTML = SKILLS.map(([n, v]) => `<div class="skill"><div class="mono">${esc(n)} <span style="float:right;color:var(--accent)">${v}%</span></div><div class="bar"><i data-w="${v}"></i></div></div>`).join("");

/* Projects */
function thumb(item, label) {
  return item.image ? `<img class="thumb" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy">` : `<div class="thumb" aria-hidden="true">${esc(label)}</div>`;
}
function renderProjects(f = "All") {
  const list = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => f === "All" || p.category === f);
  $("#projectGrid").innerHTML = list.map(({ p, i }) => `
    <button class="pcard" data-i="${i}">${thumb(p, p.category)}
      <div class="pbody"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
      <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <span class="more">View details →</span></div></button>`).join("") +
    `<div class="empty">More projects coming soon</div>`;
  $$(".pcard", $("#projectGrid")).forEach(b => b.addEventListener("click", () => showProject(+b.dataset.i)));
}
function showProject(i) {
  const p = PROJECTS[i], d = p.details;
  $("#projectBody").innerHTML = `<div class="detail">
    ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">` : ""}
    <h3>${esc(p.title)}</h3><div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    <h4>Problem</h4><p>${esc(d.problem)}</p>
    <h4>Hardware / tools</h4><p>${esc(d.hardware)}</p>
    <h4>Code</h4><pre><code>${esc(d.code)}</code></pre>
    <h4>Outcome</h4><p>${esc(d.outcome)}</p>
    <div class="links"><a class="btn small" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a><a class="btn small primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Demo</a></div></div>`;
  openModal($("#projectModal"));
}

/* Certificates */
let certView = [], lbIndex = 0;
function renderCerts(f = "All") {
  certView = CERTIFICATES.filter(c => f === "All" || c.category === f);
  $("#certGrid").innerHTML = certView.map((c, i) => `
    <button class="pcard" data-i="${i}">${thumb(c, "Certificate")}
      <div class="pbody"><h3>${esc(c.title)}</h3><p>${esc(c.issuer)} · ${esc(c.date)}</p><span class="more">View →</span></div></button>`).join("");
  $$(".pcard", $("#certGrid")).forEach(b => b.addEventListener("click", () => { lbIndex = +b.dataset.i; showCert(); openModal($("#lightbox")); }));
}
function showCert() {
  const c = certView[lbIndex]; if (!c) return;
  $("#lbBody").innerHTML = `<div class="detail">${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title)}">` : `<div class="thumb" style="margin-bottom:1rem;border-radius:12px">Certificate preview</div>`}
    <h3>${esc(c.title)}</h3><p class="small">${esc(c.issuer)} · ${esc(c.date)}</p>
    <div class="links"><a class="btn small primary" href="${esc(c.url)}" target="_blank" rel="noopener">Verify / View</a></div></div>`;
}
function lbStep(d) { if (!certView.length) return; lbIndex = (lbIndex + d + certView.length) % certView.length; showCert(); }
$("#lbPrev").addEventListener("click", () => lbStep(-1));
$("#lbNext").addEventListener("click", () => lbStep(1));
let tx = 0;
$("#lightbox").addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
$("#lightbox").addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1); });

/* Filters */
$$(".filters").forEach(group => group.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  $$(".chip", group).forEach(c => c.classList.remove("active")); b.classList.add("active");
  group.dataset.target === "projectGrid" ? renderProjects(b.dataset.f) : renderCerts(b.dataset.f);
}));
renderProjects(); renderCerts();

/* Certificate counter + reveal + skill bars */
function countUp(el, to) {
  let n = 0; const step = Math.max(1, Math.ceil(to / 30));
  const t = setInterval(() => { n = Math.min(to, n + step); el.textContent = n; if (n >= to) clearInterval(t); }, 40);
}
$$(".section > *, .hero-text").forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  $$(".bar i", en.target).forEach(b => b.style.width = b.dataset.w + "%");
  if (en.target.querySelector("#certCount")) countUp($("#certCount"), CERTIFICATES.length);
  io.unobserve(en.target);
}), { threshold: .12 });
$$(".reveal").forEach(el => io.observe(el));

/* Contact form: opens mailto */
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.website.value) return; // honeypot
  const name = $("#fName").value.trim(), mail = $("#fEmail").value.trim(), msg = $("#fMsg").value.trim();
  const err = $("#formErr");
  if (!name || !msg) { err.textContent = "Please fill in your name and message."; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) { err.textContent = "Please enter a valid email address."; return; }
  err.textContent = "";
  const link = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + name)}&body=${encodeURIComponent(msg + "\n\n— " + name + " (" + mail + ")")}`;
  $("#fallback").href = `mailto:${EMAIL}`;
  window.location.href = link;
  $("#formView").hidden = true; $("#doneView").hidden = false;
});
$$("[data-open='contactModal']").forEach(b => b.addEventListener("click", () => { $("#formView").hidden = false; $("#doneView").hidden = true; }));

/* Back to top */
$("#toTop").addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
