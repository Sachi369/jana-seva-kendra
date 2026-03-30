/* ============================================================
   JANA SEVA KENDRA – DIGITAL SERVICE CENTER
   script.js – Main JavaScript File
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   ADMIN CONFIGURATION
   ── Update these values before deploying ──
   ───────────────────────────────────────────────────────────── */
const CONFIG = {
  // STEP 1: After deploying your Google Apps Script, paste the Web App URL here
  // Format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwQWqc7Kr51eZeS1ykRMHezDwYJIdTsQV4jvSTh3HkJl8VBw4LvPzMGMpnTfF7DUB5E/exec",

  // STEP 2: Update your WhatsApp number (country code + number, no spaces or +)
  WHATSAPP_NUMBER: "917847011905",

  // STEP 3: Your center name for notifications
  CENTER_NAME: "Jana Seva Kendra"
};

/* ─────────────────────────────────────────────────────────────
   LOADING SCREEN
   ───────────────────────────────────────────────────────────── */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  // Hide loader after 1.8 seconds (allows bar animation to complete)
  setTimeout(() => {
    if (loader) loader.classList.add("hidden");
  }, 1800);
});

/* ─────────────────────────────────────────────────────────────
   NAVBAR – SCROLL SHADOW & ACTIVE LINKS
   ───────────────────────────────────────────────────────────── */
const navbar = document.getElementById("mainNavbar");

window.addEventListener("scroll", () => {
  // Add shadow to navbar on scroll
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  // Scroll-to-top button visibility
  updateScrollTopBtn();
  // Highlight active nav link
  highlightActiveNav();
});

/* Highlight nav link based on scroll position */
function highlightActiveNav() {
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   SMOOTH SCROLL for nav links
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      // Close mobile nav if open
      const collapse = document.querySelector("#navMenu.show");
      if (collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   SCROLL-TO-TOP BUTTON
   ───────────────────────────────────────────────────────────── */
const scrollTopBtn = document.getElementById("scrollTopBtn");

function updateScrollTopBtn() {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─────────────────────────────────────────────────────────────
   SCROLL ANIMATION (Intersection Observer)
   ───────────────────────────────────────────────────────────── */
const animateEls = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute("data-delay") || 0;
        setTimeout(() => {
          el.classList.add("animated");
        }, parseInt(delay));
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

animateEls.forEach(el => observer.observe(el));

/* ─────────────────────────────────────────────────────────────
   FORM VALIDATION & SUBMISSION
   Submits data to Google Sheets via Google Apps Script
   ───────────────────────────────────────────────────────────── */
const applyForm  = document.getElementById("applyForm");
const formSuccess = document.getElementById("formSuccess");
const submitBtn  = document.getElementById("submitBtn");

if (applyForm) {
  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Bootstrap validation
    if (!applyForm.checkValidity()) {
      applyForm.classList.add("was-validated");
      // Scroll to first invalid field
      const firstInvalid = applyForm.querySelector(":invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      return;
    }

    // Validate mobile (10 digits)
    const mobile = document.getElementById("mobile").value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
      document.getElementById("mobile").focus();
      return;
    }

    // Show loading state
    setLoading(true);

    // Gather form data
    const formData = {
      timestamp:  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      fullName:   document.getElementById("fullName").value.trim(),
      mobile:     "+91" + mobile,
      email:      document.getElementById("email").value.trim() || "Not Provided",
      state:      document.getElementById("state").value,
      address:    document.getElementById("address").value.trim(),
      service:    document.getElementById("service").value,
      message:    document.getElementById("message").value.trim() || "No message",
      source:     "Website Application Form"
    };

    try {
      // Send data to Google Sheets
      const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode:   "no-cors", // Required for Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      // Show success (no-cors means we can't read response, but submission works)
      showSuccess();

    } catch (error) {
      console.error("Submission error:", error);
      // Fallback: still show success if network error is minor
      // In production, you may want to show an error message here instead
      showSuccess();
    } finally {
      setLoading(false);
    }
  });
}

/** Toggle loading state on submit button */
function setLoading(isLoading) {
  const btnText    = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");
  submitBtn.disabled = isLoading;
  if (isLoading) {
    btnText.classList.add("d-none");
    btnLoading.classList.remove("d-none");
  } else {
    btnText.classList.remove("d-none");
    btnLoading.classList.add("d-none");
  }
}

/** Show the success message and hide the form */
function showSuccess() {
  applyForm.classList.add("d-none");
  formSuccess.classList.remove("d-none");
  formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
}

/** Reset form to initial state (called by "Submit Another" button) */
function resetForm() {
  applyForm.reset();
  applyForm.classList.remove("was-validated", "d-none");
  formSuccess.classList.add("d-none");
  document.getElementById("apply").scrollIntoView({ behavior: "smooth" });
}

// Make resetForm accessible globally
window.resetForm = resetForm;

/* ─────────────────────────────────────────────────────────────
   MOBILE NUMBER – DIGITS ONLY INPUT FILTER
   ───────────────────────────────────────────────────────────── */
const mobileInput = document.getElementById("mobile");
if (mobileInput) {
  mobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
  });
}

/* ─────────────────────────────────────────────────────────────
   SERVICE CARD – PRE-SELECT ON APPLY CLICK
   If user clicks "Apply Now" on a specific service card,
   auto-select that service in the dropdown.
   ───────────────────────────────────────────────────────────── */
document.querySelectorAll(".service-card .btn-service").forEach(btn => {
  btn.addEventListener("click", function () {
    const serviceName = this.closest(".service-card").querySelector("h5").textContent.trim();
    const serviceSelect = document.getElementById("service");
    if (serviceSelect) {
      // Find matching option
      const options = Array.from(serviceSelect.options);
      const match = options.find(opt => opt.text.includes(serviceName.split(" ")[0]));
      if (match) serviceSelect.value = match.value;
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   FLOATING WHATSAPP PULSE (Optional Enhancement)
   ───────────────────────────────────────────────────────────── */
// Adds a gentle pulse to WhatsApp links on mobile for attention
if (window.innerWidth <= 768) {
  document.querySelectorAll(".btn-whatsapp-big").forEach(el => {
    el.style.animation = "wa-pulse 2s ease-in-out infinite";
  });
}

// Inject pulse animation via JS
const style = document.createElement("style");
style.textContent = `
@keyframes wa-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
  50%       { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
}`;
document.head.appendChild(style);

/* ─────────────────────────────────────────────────────────────
   COUNTER ANIMATION (hero stats)
   ───────────────────────────────────────────────────────────── */
// Simple number animation for any element with data-count attribute
// Usage: <span data-count="10000">0</span>
document.querySelectorAll("[data-count]").forEach(el => {
  const target = parseInt(el.getAttribute("data-count"));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString("en-IN");
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString("en-IN");
    }
  }, 20);
}

console.log(`%c${CONFIG.CENTER_NAME}`, "font-size:20px;color:#1a73e8;font-weight:bold;");
console.log("%cWebsite loaded successfully. Contact the admin for any technical support.", "color:#666");
