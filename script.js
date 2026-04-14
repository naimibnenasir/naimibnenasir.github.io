const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const revealItems = document.querySelectorAll(".reveal");
const progressBars = document.querySelectorAll(".bar-fill");
const sections = document.querySelectorAll("main section[id]");
const scrollProgressBar = document.querySelector(".scroll-progress-bar");
const typingText = document.querySelector(".typing-text");
const cursorGlow = document.querySelector(".cursor-glow");

const savedTheme = localStorage.getItem("modern-portfolio-theme");

// Apply the saved theme or default to light mode.
const applyTheme = (theme) => {
  const darkMode = theme === "dark";
  document.body.classList.toggle("dark", darkMode);
  themeIcon.textContent = darkMode ? "\u2600\uFE0F" : "\uD83C\uDF19";
};

applyTheme(savedTheme || "light");

console.warn("This is a personal portfolio. Please respect the work.");

// Toggle between light and dark mode and store the preference.
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("modern-portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

// Toggle the mobile navigation drawer.
navToggle.addEventListener("click", () => {
  const expanded = siteNav.classList.toggle("open");
  document.body.classList.toggle("nav-open", expanded);
  navToggle.setAttribute("aria-expanded", String(expanded));
});

// Close navigation after selecting a section link.
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Basic UI-level protection against casual inspection shortcuts.
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const ctrlOrCmd = event.ctrlKey || event.metaKey;
  const blockedShortcut =
    key === "f12" ||
    (ctrlOrCmd && event.shiftKey && (key === "i" || key === "c")) ||
    (ctrlOrCmd && key === "u");

  if (blockedShortcut) {
    event.preventDefault();
  }
});

// Reveal cards smoothly while scrolling.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Animate the bars when their section becomes visible.
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.progress}%`;
        progressObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

progressBars.forEach((bar) => progressObserver.observe(bar));

// Type through role-focused phrases in the hero section.
if (typingText) {
  const phrases = (typingText.dataset.phrases || "")
    .split(",")
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tickTyping = () => {
    const current = phrases[phraseIndex] || "";
    typingText.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(tickTyping, 90);
      return;
    }

    if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(tickTyping, 1300);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(tickTyping, 45);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(tickTyping, 180);
  };

  tickTyping();
}

// Track page scroll progress for the top progress indicator.
const updateScrollProgress = () => {
  if (!scrollProgressBar) {
    return;
  }

  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;
  scrollProgressBar.style.width = `${progress}%`;
};

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

// Add a subtle cursor glow for pointer devices.
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  document.body.classList.add("cursor-active");

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  const animateCursor = () => {
    cursorX += (targetX - cursorX) * 0.22;
    cursorY += (targetY - cursorY) * 0.22;
    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;
    window.requestAnimationFrame(animateCursor);
  };

  window.requestAnimationFrame(animateCursor);

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    },
    { passive: true }
  );

  document.querySelectorAll("a, button, .glass, .tool-pill, .tag").forEach((element) => {
    element.addEventListener("pointerenter", () => {
      cursorGlow.style.width = "22px";
      cursorGlow.style.height = "22px";
      cursorGlow.style.boxShadow = "0 0 0 10px rgba(99, 102, 241, 0.14), 0 0 26px rgba(99, 102, 241, 0.22)";
    });

    element.addEventListener("pointerleave", () => {
      cursorGlow.style.width = "12px";
      cursorGlow.style.height = "12px";
      cursorGlow.style.boxShadow = "0 0 0 6px rgba(99, 102, 241, 0.12), 0 0 20px rgba(99, 102, 241, 0.18)";
    });
  });
}

// Highlight the active section in the navigation.
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.site-nav a[href="#${id}"]`);
      navLinks.forEach((link) => link.classList.remove("active"));
      if (activeLink) {
        activeLink.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-45% 0px -40% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => navObserver.observe(section));
