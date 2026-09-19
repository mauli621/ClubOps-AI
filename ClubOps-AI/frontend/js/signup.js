// ClubOps AI — sign-up page behavior
// Handles: role switching (Student / Club Head / Volunteer), per-role fields,
// client-side validation, password confirmation, and a mock account-creation flow.
// Wire the `submitSignup()` function to your real backend/API when ready.

(function () {
  const ROLES = {
    student: {
      label: "Student",
      accentVar: "--student",
      accentSoftVar: "--student-soft",
      submitLabel: "Create Student account",
      requiredFields: ["fullName", "rollNo", "department", "email", "password", "confirmPassword"],
      features: [
        "See your assigned tasks and deadlines",
        "Get reminders before meetings and submissions",
        "Access shared club documents",
      ],
    },
    head: {
      label: "Club Head",
      accentVar: "--head",
      accentSoftVar: "--head-soft",
      submitLabel: "Create Club Head account",
      requiredFields: ["fullName", "clubName", "clubCategory", "email", "password", "confirmPassword"],
      features: [
        "Run the whole event from one dashboard",
        "Assign tasks and track who owns what",
        "Get AI-flagged risks before they become problems",
      ],
    },
    volunteer: {
      label: "Volunteer",
      accentVar: "--volunteer",
      accentSoftVar: "--volunteer-soft",
      submitLabel: "Create Volunteer account",
      requiredFields: ["fullName", "phone", "interest", "email", "password", "confirmPassword"],
      features: [
        "Pick up shifts that match your interests",
        "Get reminders for the slots you've claimed",
        "Message the team without hunting for a group chat",
      ],
    },
  };

  let currentRole = "student";

  const root = document.documentElement;
  const roleTabs = document.querySelectorAll(".role-tab");
  const conditionalFields = document.querySelectorAll(".field--conditional");
  const brandRoleLabel = document.getElementById("brandRoleLabel");
  const brandFeatures = document.getElementById("brandFeatures");
  const submitLabel = document.getElementById("submitLabel");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("signupForm");
  const formStatus = document.getElementById("formStatus");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePwBtn = document.getElementById("togglePw");
  const toggleConfirmPwBtn = document.getElementById("toggleConfirmPw");

  function setRole(role) {
    if (!ROLES[role]) return;
    currentRole = role;
    const cfg = ROLES[role];

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
        if (!show) input.value = "";
        clearFieldError(input.id);
      }
    });

    brandRoleLabel.textContent = cfg.label;
    submitLabel.textContent = cfg.submitLabel;
    brandFeatures.innerHTML = cfg.features
      .map((text) => `<li><span class="feat-mark">•</span> ${text}</li>`)
      .join("");
    clearFormStatus();
  }

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => setRole(tab.dataset.role));
  });

  function wirePasswordToggle(btn, input) {
    btn.addEventListener("click", () => {
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  }
  wirePasswordToggle(togglePwBtn, passwordInput);
  wirePasswordToggle(toggleConfirmPwBtn, confirmPasswordInput);

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
    clearFieldError("terms");

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

    if (passwordInput.value && confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
      showFieldError("confirmPassword", "Passwords don't match.");
      valid = false;
    }

    if (!document.getElementById("terms").checked) {
      showFieldError("terms", "You need to agree before creating an account.");
      valid = false;
    }

    return valid;
  }

  // Mock account creation — replace this with a real API call, e.g.:
  //   const res = await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(payload) });
  function submitSignup(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true, userId: "demo-user-" + Date.now(), role: payload.role });
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
    delete payload.confirmPassword;

    submitBtn.disabled = true;
    submitLabel.textContent = "Creating account…";

    try {
      const result = await submitSignup(payload);
      if (result.ok) {
        setFormStatus(`Account created as ${ROLES[currentRole].label}. Redirecting to sign in…`, "success");
        // window.location.href = "login.html";
      } else {
        setFormStatus("Couldn't create your account. Please try again.", "error");
      }
    } catch (err) {
      setFormStatus("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = ROLES[currentRole].submitLabel;
    }
  });

  // init
  setRole("student");
})();
