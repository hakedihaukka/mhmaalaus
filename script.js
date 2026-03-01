const hero = document.getElementById("hero");
let ticking = false;

const rotatingText = document.getElementById("hero-rotating-text");
const pageName = window.location.pathname.split("/").pop() || "index.html";
const pageRotatingWords = {
  "index.html": [
    'Automaalaamo <span class="hero-word-highlight">Joutsassa</span>',
    'Nopealla <span class="hero-word-highlight">aikataululla</span>',
    'Freelancer <span class="hero-word-highlight">maalaukset</span>',
  ],
  "kuvat.html": [
    'Laadukas <span class="hero-word-highlight">työnjälki</span>',
    'Ammattitasoista <span class="hero-word-highlight">maalaamista</span>',
    'Lopputulos <span class="hero-word-highlight">mikä miellyttää</span>',
  ],
  "maalit.html": [
    'Maalit <span class="hero-word-highlight">Joutsassa</span>',
    'Tarkat <span class="hero-word-highlight">sävyt</span>',
    'Kilpailukykyiset <span class="hero-word-highlight">hinnat</span>',
  ],
  "yhteystiedot.html": [
    'Yhteystiedot <span class="hero-word-highlight">Joutsa</span>',
    'Nopea <span class="hero-word-highlight">tarjouspyyntö</span>',
    'Palvelu <span class="hero-word-highlight">Keski-Suomessa</span>',
  ],
};
const rotatingWords = pageRotatingWords[pageName] || pageRotatingWords["index.html"];
let rotateIndex = 0;
const servicesLink = document.querySelector('.hero-btn-secondary[href="#automaalaus"]');
const servicesSection = document.getElementById("automaalaus");
const nav = document.querySelector(".hero-nav");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".hero-menu");
const cookieConsentKey = "mh_cookie_consent_v1";
const formRateLimitKey = "mh_form_rate_v1";
const minSecondsBetweenSubmissions = 45;
const maxSubmissionsPerWindow = 3;
const submissionWindowMs = 10 * 60 * 1000;
const analyticsMeasurementId = "G-XXXXXXXXXX";
let analyticsLoaded = false;
let cookieBannerEl = null;
let cookieSettingsBtn = null;

document.documentElement.classList.add("js");

function syncHeroNavHeight() {
  const nav = document.querySelector(".hero-nav");
  if (!nav) return;
  document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
}

function updateHeroSlide() {
  if (nav) {
    const y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("is-scrolled", y > 8);
  }

  if (!hero) {
    ticking = false;
    return;
  }
  const y = window.scrollY || window.pageYOffset;
  hero.classList.toggle("is-slid", y > 40);
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(updateHeroSlide);
    ticking = true;
  }
});

function startHeroTextLoop() {
  if (!rotatingText) return;
  rotatingText.innerHTML = rotatingWords[0];

  const duration = 320;
  const delay = 2200;

  setInterval(() => {
    rotatingText.classList.add("is-exiting");

    window.setTimeout(() => {
      rotateIndex = (rotateIndex + 1) % rotatingWords.length;
      rotatingText.classList.remove("is-exiting");
      rotatingText.classList.add("is-entering");
      rotatingText.innerHTML = rotatingWords[rotateIndex];

      window.requestAnimationFrame(() => {
        rotatingText.classList.remove("is-entering");
      });
    }, duration);
  }, delay + duration);
}

function closeMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Avaa valikko");
  document.body.classList.remove("nav-open");
}

function openMobileNav() {
  if (!nav || !navToggle) return;
  nav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Sulje valikko");
  document.body.classList.add("nav-open");
}

function initMobileNav() {
  if (!nav || !navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.getComputedStyle(navToggle).display === "none") {
      closeMobileNav();
    }
  });
}

function initHeroReveal() {
  window.requestAnimationFrame(() => {
    document.body.classList.add("is-loaded");
  });
}

function initSectionReveal() {
  const sections = document.querySelectorAll(".service-section, .gallery-section, .info-section");
  if (!sections.length) return;

  sections.forEach((section) => {
    section.classList.add("reveal-on-scroll");
  });

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function getCookieConsent() {
  try {
    return window.localStorage.getItem(cookieConsentKey);
  } catch (error) {
    return null;
  }
}

function setCookieConsent(value) {
  try {
    window.localStorage.setItem(cookieConsentKey, value);
  } catch (error) {
    // Ignore storage errors in private modes.
  }
}

function isValidMeasurementId(value) {
  return /^G-[A-Z0-9]+$/i.test(value) && value !== "G-XXXXXXXXXX";
}

function loadAnalyticsIfAllowed() {
  if (analyticsLoaded || !isValidMeasurementId(analyticsMeasurementId)) return;
  analyticsLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsMeasurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", analyticsMeasurementId);
}

function applyConsent(consent, persist = true) {
  if (persist) {
    setCookieConsent(consent);
  }

  if (consent === "all") {
    loadAnalyticsIfAllowed();
    if (window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    return;
  }

  if (window.gtag && isValidMeasurementId(analyticsMeasurementId)) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
}

function removeCookieBanner() {
  if (!cookieBannerEl) return;
  cookieBannerEl.classList.remove("is-visible");
  document.body.classList.remove("cookie-open");
  window.setTimeout(() => {
    if (cookieBannerEl) {
      cookieBannerEl.remove();
      cookieBannerEl = null;
    }
  }, 220);
}

function openCookieBanner() {
  if (cookieBannerEl) {
    document.body.classList.add("cookie-open");
    window.requestAnimationFrame(() => cookieBannerEl.classList.add("is-visible"));
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "cookie-banner";
  wrapper.innerHTML = `
    <div class="cookie-card" role="dialog" aria-live="polite" aria-label="Evästesuostumus">
      <p class="cookie-title">Evästeet sivustolla</p>
      <p class="cookie-text">
        Käytämme välttämättömiä evästeitä sivuston toimintaan. Tilastointi (Google Analytics)
        otetaan käyttöön vain, jos hyväksyt kaikki evästeet.
      </p>
      <div class="cookie-actions">
        <button type="button" class="cookie-btn cookie-btn-primary" data-consent="all">Hyväksy kaikki</button>
        <button type="button" class="cookie-btn cookie-btn-secondary" data-consent="necessary">Vain välttämättömät</button>
      </div>
    </div>
  `;

  wrapper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-consent]");
    if (!button) return;
    applyConsent(button.getAttribute("data-consent"));
    removeCookieBanner();
  });

  cookieBannerEl = wrapper;
  document.body.appendChild(wrapper);
  document.body.classList.add("cookie-open");
  window.requestAnimationFrame(() => wrapper.classList.add("is-visible"));
}

function initCookieSettingsButton() {
  if (cookieSettingsBtn) return;
  cookieSettingsBtn = document.createElement("button");
  cookieSettingsBtn.type = "button";
  cookieSettingsBtn.className = "cookie-settings-btn";
  cookieSettingsBtn.textContent = "Evästeasetukset";
  cookieSettingsBtn.setAttribute("aria-label", "Avaa evästeasetukset");
  cookieSettingsBtn.addEventListener("click", () => {
    openCookieBanner();
  });
  document.body.appendChild(cookieSettingsBtn);
}

function initCookieBanner() {
  const savedConsent = getCookieConsent();
  if (savedConsent) {
    applyConsent(savedConsent, false);
  } else {
    openCookieBanner();
  }
  initCookieSettingsButton();
}

function initContactForms() {
  const forms = document.querySelectorAll(".js-formspree-form");
  if (!forms.length) return;

  function readSubmissionHistory() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(formRateLimitKey) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((value) => Number.isFinite(value));
    } catch (error) {
      return [];
    }
  }

  function writeSubmissionHistory(values) {
    try {
      window.localStorage.setItem(formRateLimitKey, JSON.stringify(values));
    } catch (error) {
      // Ignore storage errors in private mode.
    }
  }

  function getRateLimitMessage() {
    const now = Date.now();
    const history = readSubmissionHistory().filter((ts) => now - ts < submissionWindowMs);
    writeSubmissionHistory(history);

    if (!history.length) return "";

    const lastSubmittedAt = history[history.length - 1];
    const waitMs = minSecondsBetweenSubmissions * 1000 - (now - lastSubmittedAt);
    if (waitMs > 0) {
      const waitSeconds = Math.ceil(waitMs / 1000);
      return `Odota ${waitSeconds} sekuntia ennen uutta lähetystä.`;
    }

    if (history.length >= maxSubmissionsPerWindow) {
      const unlockInMs = submissionWindowMs - (now - history[0]);
      const unlockMinutes = Math.ceil(unlockInMs / 60000);
      return `Liian monta viestiä lyhyessä ajassa. Yritä uudelleen noin ${unlockMinutes} min kuluttua.`;
    }

    return "";
  }

  function markSubmissionSuccess() {
    const now = Date.now();
    const history = readSubmissionHistory().filter((ts) => now - ts < submissionWindowMs);
    history.push(now);
    writeSubmissionHistory(history);
  }

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const statusEl = form.querySelector(".form-status");
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";
      const rateLimitMessage = getRateLimitMessage();

      if (rateLimitMessage) {
        if (statusEl) statusEl.textContent = rateLimitMessage;
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        if (statusEl) statusEl.textContent = "Tarkista lomakkeen kentät.";
        return;
      }

      if (statusEl) {
        statusEl.textContent = "Lähetetään...";
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Lähetetään...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          markSubmissionSuccess();
          form.reset();
          if (statusEl) {
            statusEl.textContent = "Kiitos! Viesti lähetettiin onnistuneesti.";
          }
          return;
        }

        let errorMessage = "Lähetys epäonnistui. Yritä hetken kuluttua uudelleen.";
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length && data.errors[0].message) {
            errorMessage = data.errors[0].message;
          }
        } catch (error) {
          
        }

        if (statusEl) {
          statusEl.textContent = errorMessage;
        }
      } catch (error) {
        if (statusEl) {
          statusEl.textContent = "Lähetys epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  });
}

function initProductFilters() {
  const cards = Array.from(document.querySelectorAll(".product-card[data-category]"));
  const filterButtons = Array.from(document.querySelectorAll(".product-filter-btn[data-filter]"));
  const quickFilterLinks = Array.from(document.querySelectorAll("[data-quick-filter]"));

  if (!cards.length || !filterButtons.length) return;

  function applyFilter(filter) {
    cards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });

    filterButtons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
    button.addEventListener("click", () => {
      applyFilter(button.getAttribute("data-filter") || "all");
    });
  });

  quickFilterLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const filter = link.getAttribute("data-quick-filter") || "all";
      applyFilter(filter);
    });
  });

  applyFilter("all");
}

startHeroTextLoop();
syncHeroNavHeight();
initMobileNav();
initHeroReveal();
initSectionReveal();
initCookieBanner();
initContactForms();
initProductFilters();
updateHeroSlide();

window.addEventListener("resize", syncHeroNavHeight);
window.addEventListener("orientationchange", syncHeroNavHeight);

if (servicesLink && servicesSection) {
  servicesLink.addEventListener("click", (event) => {
    event.preventDefault();

    const nav = document.querySelector(".hero-nav");
    const navHeight = nav ? nav.offsetHeight : 0;
    const sectionTop = servicesSection.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - navHeight,
      behavior: "smooth",
    });
  });
}
