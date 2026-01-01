const PHOTOS = [
  "./resources/1000061483.jpg",
  "./resources/1000060609.jpg",
  "resources/IMG_20251224_105355 (1).jpg",
  "./resources/IMG_20251224_105314 (1).jpg",
  "./resources/IMG_20251214_184045.jpg",
  "./resources/IMG_20251220_110739.jpg",
  "./resources/IMG_20251213_221859.jpg",
  "./resources/IMG_20251214_160353.jpg",
  "./resources/IMG_20251222_100645.jpg",
  "./resources/1000061763.jpg",
];

const I18N = {
  es: {
    name: "Luis Alberto Rodríguez",
    meta: "Actor · Español e inglés · Madrid | Gran Canaria",
    line: "Inspirar al mundo desde la gran pantalla.",
    videoTitle: "Videobook",
    contactTitle: "Contacto",
    emailLabel: "Email",
    instaLabel: "Instagram",
    footSmall: "Madrid · Gran Canaria",
  },
  en: {
    name: "Luis Alberto Rodríguez",
    meta: "Actor · Spanish & English · Madrid | Gran Canaria",
    line: "Inspire the world from the big screen.",
    videoTitle: "Videobook",
    contactTitle: "Contact",
    emailLabel: "Email",
    instaLabel: "Instagram",
    footSmall: "Madrid · Gran Canaria",
  },
};

const state = {
  lang: "es",
  index: 0,
  timer: null,
  autoMs: 3000, // ✅ 3 seconds
};

// DOM
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const heroImg = document.getElementById("heroImg");
const thumbRail = document.getElementById("thumbRail");
const count = document.getElementById("count");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const frame = document.getElementById("showcaseFrame");

// lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");

function openLightbox(src) {
  if (!lb || !lbImg) return;
  lbImg.src = src;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  if (!lb || !lbImg) return;
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  lbImg.src = "";
}
lbClose?.addEventListener("click", closeLightbox);
lb?.addEventListener("click", (e) => {
  if (e.target === lb) closeLightbox();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function setActive(i, { user = false } = {}) {
  state.index = (i + PHOTOS.length) % PHOTOS.length;

  if (heroImg) {
    heroImg.src = PHOTOS[state.index];
    heroImg.alt = `Foto ${state.index + 1}`;
  }

  if (count) {
    count.textContent = `${state.index + 1} / ${PHOTOS.length}`;
  }

  const thumbs = Array.from(thumbRail?.querySelectorAll(".thumb") || []);
  thumbs.forEach((t, idx) =>
    t.classList.toggle("is-active", idx === state.index)
  );
  const active = thumbs[state.index];
  active?.scrollIntoView?.({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });

  if (user) restartAutoplay();
}

function buildThumbs() {
  if (!thumbRail) return;
  thumbRail.innerHTML = "";

  PHOTOS.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb";
    btn.setAttribute("aria-label", `Ir a foto ${i + 1}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Miniatura ${i + 1}`;
    img.loading = "lazy";

    btn.appendChild(img);
    btn.addEventListener("click", () => setActive(i, { user: true }));

    thumbRail.appendChild(btn);
  });
}

function nextSlide(user = false) {
  setActive(state.index + 1, { user });
}
function prevSlide(user = false) {
  setActive(state.index - 1, { user });
}

prev?.addEventListener("click", () => prevSlide(true));
next?.addEventListener("click", () => nextSlide(true));

// keyboard (when lightbox closed)
window.addEventListener("keydown", (e) => {
  if (lb?.classList.contains("open")) return;
  if (e.key === "ArrowRight") nextSlide(true);
  if (e.key === "ArrowLeft") prevSlide(true);
});

// click featured -> lightbox
frame?.addEventListener("click", () => openLightbox(PHOTOS[state.index]));
frame?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openLightbox(PHOTOS[state.index]);
});

// autoplay
function startAutoplay() {
  stopAutoplay();
  state.timer = setInterval(() => nextSlide(false), state.autoMs);
}
function stopAutoplay() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}
function restartAutoplay() {
  startAutoplay();
}

// pause on interaction
const pauseTargets = [frame, thumbRail, prev, next].filter(Boolean);
pauseTargets.forEach((el) => {
  el.addEventListener("mouseenter", stopAutoplay);
  el.addEventListener("mouseleave", startAutoplay);
  el.addEventListener("focusin", stopAutoplay);
  el.addEventListener("focusout", startAutoplay);
});

// i18n
function applyI18n() {
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = I18N[state.lang][key];
    if (val) el.textContent = val;
  });

  const pill = document.getElementById("langPill");
  const hint = document.getElementById("langHint");
  if (pill && hint) {
    pill.textContent = state.lang.toUpperCase();
    hint.textContent = state.lang === "es" ? "EN" : "ES";
  }
}

function initLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved === "es" || saved === "en") state.lang = saved;
  else
    state.lang = navigator.language?.toLowerCase().startsWith("en")
      ? "en"
      : "es";

  document.getElementById("langToggle")?.addEventListener("click", () => {
    state.lang = state.lang === "es" ? "en" : "es";
    localStorage.setItem("lang", state.lang);
    applyI18n();
  });
}

// init
initLanguage();
applyI18n();
buildThumbs();
setActive(0);
startAutoplay();
