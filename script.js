// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------- Theme toggle (remembers choice) ----------
const themeBtn = $("#theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const menuBtn = $("#menu-toggle");
const navLinks = $("#nav-links");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

$$("#nav-links a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- Typing effect ----------
const roles = ["Web Developer", "Problem Solver", "Lifelong Learner"];
const typedEl = $("#typed-text");
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = roles[roleIndex];
  typedEl.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- Scroll reveal + skill bars ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      const fill = $(".bar-fill", entry.target);
      if (fill) fill.style.width = fill.dataset.level + "%";

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => observer.observe(el));

// ---------- Project filter ----------
const filterBtns = $$(".filter");
const cards = $$(".card");

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
    });
  })
);

// ---------- Active nav link on scroll ----------
const sections = $$("main section[id]");
const links = $$("#nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

// ---------- Back to top button ----------
const toTop = $("#to-top");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Contact form validation ----------
const form = $("#contact-form");
const status = $("#form-status");

function setError(input, message) {
  const field = input.closest(".field");
  $(".error", field).textContent = message;
  field.classList.toggle("invalid", Boolean(message));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";

  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  let valid = true;

  if (name.value.trim().length < 2) {
    setError(name, "Please enter your name.");
    valid = false;
  } else setError(name, "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Please enter a valid email address.");
    valid = false;
  } else setError(email, "");

  if (message.value.trim().length < 10) {
    setError(message, "Message should be at least 10 characters.");
    valid = false;
  } else setError(message, "");

  if (!valid) return;

  // No backend yet: this just simulates a successful send.
  // To make it real, post the data to a service like Formspree or your own API.
  status.textContent = "Thanks! Your message has been sent.";
  form.reset();
});

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();