const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const topbar = document.querySelector(".topbar");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const revealItems = document.querySelectorAll(".reveal");
const expandableCards = document.querySelectorAll("[data-expandable]");
const projectAccordions = document.querySelectorAll("[data-accordion]");
const projectCards = document.querySelectorAll("[data-project-card]");
const projectVideoPlayers = document.querySelectorAll("[data-video-player]");
const videoPopup = document.querySelector("[data-video-popup]");
const videoPopupLink = document.querySelector("[data-video-popup-link]");
const videoPopupCloseTargets = document.querySelectorAll("[data-video-close]");
const wechatPopup = document.querySelector("[data-wechat-popup]");
const wechatPopupTrigger = document.querySelector("[data-wechat-popup-trigger]");
const wechatPopupCloseTargets = document.querySelectorAll("[data-wechat-close]");
const revealSections = document.querySelectorAll(".reveal-section");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxTrack = document.querySelector("[data-lightbox-track]");
const lightboxCloseTargets = document.querySelectorAll("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-trigger]");

const updateTopbar = () => {
  const landing = document.querySelector("#landing");
  const threshold = landing ? landing.offsetHeight * 0.45 : 18;
  const scrolled = window.scrollY > threshold;
  topbar.classList.toggle("scrolled", scrolled);
  topbar.classList.toggle("topbar-hidden", !scrolled);
};

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

const updateSectionMotion = () => {
  if (prefersReducedMotion.matches) {
    revealSections.forEach((section) => {
      section.style.setProperty("--section-float", "0px");
    });
    return;
  }

  const viewportHeight = window.innerHeight || 1;

  revealSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distance = (sectionCenter - viewportCenter) / viewportHeight;
    const clamped = Math.max(-1, Math.min(1, distance));
    const translate = clamped * -16;
    section.style.setProperty("--section-float", `${translate.toFixed(2)}px`);
  });
};

const closeMobileMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      closeMobileMenu();
    }
  });
});

if (!prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

const copyToClipboard = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-trigger");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const value = button.dataset.copy;
  if (!value) return;

  const feedbackHost = button.closest(".contact-row") ?? button;

  try {
    await copyToClipboard(value);
    feedbackHost.classList.add("copied");
    window.setTimeout(() => {
      feedbackHost.classList.remove("copied");
    }, 1000);
  } catch {
    feedbackHost.classList.remove("copied");
  }
});

expandableCards.forEach((card) => {
  const trigger = card.querySelector("[data-expand-trigger]");
  trigger?.addEventListener("click", () => {
    const isOpen = !card.classList.contains("open");

    expandableCards.forEach((otherCard) => {
      if (otherCard === card) return;
      otherCard.classList.remove("open");
      const otherTrigger = otherCard.querySelector("[data-expand-trigger]");
      otherTrigger?.setAttribute("aria-expanded", "false");
    });

    card.classList.toggle("open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

projectAccordions.forEach((section) => {
  const trigger = section.querySelector(".project-accordion-trigger");
  trigger?.addEventListener("click", () => {
    const isOpen = section.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

projectCards.forEach((card) => {
  const trigger = card.querySelector(".project-card-toggle");
  trigger?.addEventListener("click", () => {
    const isOpen = card.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

projectVideoPlayers.forEach((player) => {
  const trigger = player.querySelector("[data-video-trigger]");
  const videoUrl = player.dataset.videoUrl;

  trigger?.addEventListener("click", () => {
    if (!videoPopup || !videoPopupLink || !videoUrl) return;

    videoPopupLink.href = videoUrl;
    videoPopup.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

videoPopupCloseTargets.forEach((target) => {
  target.addEventListener("click", () => {
    if (!videoPopup) return;
    videoPopup.hidden = true;
    document.body.style.overflow = "";
  });
});

wechatPopupTrigger?.addEventListener("click", () => {
  if (!wechatPopup) return;
  wechatPopup.hidden = false;
  document.body.style.overflow = "hidden";
});

wechatPopupCloseTargets.forEach((target) => {
  target.addEventListener("click", () => {
    if (!wechatPopup) return;
    wechatPopup.hidden = true;
    document.body.style.overflow = "";
  });
});

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!lightbox || !lightboxTrack) return;

    const src = trigger.dataset.lightboxSrc;
    const alt = trigger.dataset.lightboxAlt ?? "";
    const group = trigger.dataset.lightboxGroup ?? "";
    if (!src) return;

    const groupItems = group
      ? [...document.querySelectorAll(`[data-lightbox-trigger][data-lightbox-group="${group}"]`)]
      : [trigger];

    lightboxTrack.innerHTML = "";

    groupItems.forEach((item) => {
      const slide = document.createElement("div");
      slide.className = "lightbox-slide";

      const image = document.createElement("img");
      image.src = item.dataset.lightboxSrc ?? "";
      image.alt = item.dataset.lightboxAlt ?? "";

      slide.appendChild(image);
      lightboxTrack.appendChild(slide);
    });

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

    const targetIndex = Math.max(0, groupItems.indexOf(trigger));
    const slideWidth = lightboxTrack.clientWidth + 18;
    window.requestAnimationFrame(() => {
      lightboxTrack.scrollTo({
        left: targetIndex * slideWidth,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      });
    });
  });
});

lightboxCloseTargets.forEach((target) => {
  target.addEventListener("click", () => {
    if (!lightbox || !lightboxTrack) return;
    lightbox.hidden = true;
    lightboxTrack.innerHTML = "";
    document.body.style.overflow = "";
  });
});

window.addEventListener("scroll", () => {
  updateTopbar();
  updateProgress();
  updateSectionMotion();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  updateSectionMotion();
});

updateTopbar();
updateProgress();
updateSectionMotion();
