// ClubOps AI — login page behavior
// Handles: role switching (Student / Club Head / Volunteer), per-role fields,
// client-side validation, password visibility toggle, and a mock sign-in flow.
// Wire the `submitLogin()` function to your real backend/API when ready —
// it currently just simulates a network call and stores the session locally.

(function () {
  const ROLES = {
    student: {
      label: "Student",
      accentVar: "--student",
      accentSoftVar: "--student-soft",
      submitLabel: "Sign in as Student",
      requiredFields: ["rollNo", "email", "password"],
    },
    head: {
      label: "Club Head",
      accentVar: "--head",
      accentSoftVar: "--head-soft",
      submitLabel: "Sign in as Club Head",
      requiredFields: ["clubName", "email", "password"],
    },
    volunteer: {
      label: "Volunteer",
      accentVar: "--volunteer",
      accentSoftVar: "--volunteer-soft",
      submitLabel: "Sign in as Volunteer",
      requiredFields: ["phone", "email", "password"],
    },
  };

  let currentRole = "student";

  const root = document.documentElement;
  const roleTabs = document.querySelectorAll(".role-tab");
  const conditionalFields = document.querySelectorAll(".field--conditional");
  const brandRoleLabel = document.getElementById("brandRoleLabel");
  const submitLabel = document.getElementById("submitLabel");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("loginForm");
  const formStatus = document.getElementById("formStatus");
  const togglePwBtn = document.getElementById("togglePw");
  const passwordInput = document.getElementById("password");
  const forgotLink = document.getElementById("forgotLink");
  const signupLink = document.getElementById("signupLink");

  function setRole(role) {
    if (!ROLES[role]) return;
    currentRole = role;
    const cfg = ROLES[role];

    // swap CSS custom properties so the accent color updates everywhere
    const rootStyles = getComputedStyle(root);
    root.style.setProperty("--accent", rootStyles.getPropertyValue(cfg.accentVar).trim());
    root.style.setProperty("--accent-soft", rootStyles.getPropertyValue(cfg.accentSoftVar).trim());

    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.role === role;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    conditionalFields.forEach((field) => {
      const show = field.dataset.for === role;
      field.hidden = !show;
      const input = field.querySelector("input");
      if (input) {
        // clear hidden fields so stale values from another role don't submit
        if (!show) input.value = "";
        clearFieldError(input.id);
      }
    });

    brandRoleLabel.textContent = cfg.label;
    submitLabel.textContent = cfg.submitLabel;
    clearFormStatus();
  }

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => setRole(tab.dataset.role));
  });

  togglePwBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePwBtn.textContent = isHidden ? "Hide" : "Show";
    togglePwBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });

  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (input) input.classList.remove("has-error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
    }
  }

  function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);
    if (input) input.classList.add("has-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  function setFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.remove("is-error", "is-success");
    if (type) formStatus.classList.add(type === "error" ? "is-error" : "is-success");
  }

  function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return /^[0-9\s+()-]{7,15}$/.test(value);
  }

  function validate() {
    let valid = true;
    const cfg = ROLES[currentRole];

    cfg.requiredFields.forEach((fieldId) => clearFieldError(fieldId));

    cfg.requiredFields.forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      const value = input.value.trim();

      if (!value) {
        showFieldError(fieldId, "This field is required.");
        valid = false;
        return;
      }

      if (fieldId === "email" && !isValidEmail(value)) {
        showFieldError(fieldId, "Enter a valid email address.");
        valid = false;
      }

      if (fieldId === "phone" && !isValidPhone(value)) {
        showFieldError(fieldId, "Enter a valid phone number.");
        valid = false;
      }

      if (fieldId === "password" && value.length < 6) {
        showFieldError(fieldId, "Password must be at least 6 characters.");
        valid = false;
      }
    });

    return valid;
  }

  // Mock sign-in — replace this with a real API call, e.g.:
  //   const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
  function submitLogin(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true, token: "demo-token-" + Date.now(), role: payload.role });
      }, 700);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormStatus();

    if (!validate()) {
      setFormStatus("Please fix the highlighted fields.", "error");
      return;
    }

    const cfg = ROLES[currentRole];
    const payload = { role: currentRole };
    cfg.requiredFields.forEach((fieldId) => {
      payload[fieldId] = document.getElementById(fieldId).value.trim();
    });
    payload.remember = document.getElementById("remember").checked;

    submitBtn.disabled = true;
    submitLabel.textContent = "Signing in…";

    try {
      const result = await submitLogin(payload);
      if (result.ok) {
        // demo persistence only — swap for real session/JWT handling
        const storage = payload.remember ? localStorage : sessionStorage;
        storage.setItem("clubops_session", JSON.stringify({ role: result.role, token: result.token }));
        setFormStatus(`Signed in as ${ROLES[currentRole].label}. Redirecting…`, "success");
        // window.location.href = `/dashboard/${currentRole}.html`;
      } else {
        setFormStatus("Sign-in failed. Check your details and try again.", "error");
      }
    } catch (err) {
      setFormStatus("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = ROLES[currentRole].submitLabel;
    }
  });

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    setFormStatus("Password reset isn't wired up yet — link this to your reset flow.", "error");
  });

  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    setFormStatus("Sign-up isn't wired up yet — link this to your registration page.", "error");
  });

  // init
  setRole("student");
})();
