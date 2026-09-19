// ClubOps AI — login page behavior
//
// Handles:
// - Role switching (Student / Club Head / Volunteer)
// - Per-role fields
// - Client-side validation
// - Password visibility toggle
// - Forgot password message
// - Mock sign-in flow
// - Session storage / local storage
//
// The "Create an account" link uses normal HTML navigation
// and is NOT blocked by JavaScript.

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

  /*
   * Role switching
   */
  function setRole(role) {
    if (!ROLES[role]) {
      return;
    }

    currentRole = role;

    const cfg = ROLES[role];

    // Get CSS variables
    const rootStyles = getComputedStyle(root);

    const accent = rootStyles.getPropertyValue(cfg.accentVar).trim();

    const accentSoft = rootStyles.getPropertyValue(cfg.accentSoftVar).trim();

    // Update active accent colors
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-soft", accentSoft);

    // Update role tabs
    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.role === role;

      tab.classList.toggle("is-active", isActive);

      tab.setAttribute("aria-selected", String(isActive));
    });

    // Show / hide role-specific fields
    conditionalFields.forEach((field) => {
      const show = field.dataset.for === role;

      field.hidden = !show;

      const input = field.querySelector("input");

      if (input) {
        // Clear hidden field values
        if (!show) {
          input.value = "";
        }

        clearFieldError(input.id);
      }
    });

    // Update left panel role
    if (brandRoleLabel) {
      brandRoleLabel.textContent = cfg.label;
    }

    // Update submit button
    if (submitLabel) {
      submitLabel.textContent = cfg.submitLabel;
    }

    clearFormStatus();
  }

  /*
   * Role tab click
   */
  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setRole(tab.dataset.role);
    });
  });

  /*
   * Password visibility toggle
   */
  if (togglePwBtn && passwordInput) {
    togglePwBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";

      togglePwBtn.textContent = isHidden ? "Hide" : "Show";

      togglePwBtn.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password",
      );
    });
  }

  /*
   * Clear field error
   */
  function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);

    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);

    if (input) {
      input.classList.remove("has-error");
    }

    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
    }
  }

  /*
   * Show field error
   */
  function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);

    const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);

    if (input) {
      input.classList.add("has-error");
    }

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  /*
   * Form status
   */
  function setFormStatus(message, type) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;

    formStatus.classList.remove("is-error", "is-success");

    if (type) {
      formStatus.classList.add(type === "error" ? "is-error" : "is-success");
    }
  }

  /*
   * Clear form status
   */
  function clearFormStatus() {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = "";

    formStatus.classList.remove("is-error", "is-success");
  }

  /*
   * Email validation
   */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /*
   * Phone validation
   */
  function isValidPhone(value) {
    return /^[0-9\s+()-]{7,15}$/.test(value);
  }

  /*
   * Validate login form
   */
  function validate() {
    let valid = true;

    const cfg = ROLES[currentRole];

    // Clear old errors
    cfg.requiredFields.forEach((fieldId) => {
      clearFieldError(fieldId);
    });

    // Validate required fields
    cfg.requiredFields.forEach((fieldId) => {
      const input = document.getElementById(fieldId);

      if (!input) {
        return;
      }

      const value = input.value.trim();

      // Required validation
      if (!value) {
        showFieldError(fieldId, "This field is required.");

        valid = false;
        return;
      }

      // Email validation
      if (fieldId === "email" && !isValidEmail(value)) {
        showFieldError(fieldId, "Enter a valid email address.");

        valid = false;
      }

      // Phone validation
      if (fieldId === "phone" && !isValidPhone(value)) {
        showFieldError(fieldId, "Enter a valid phone number.");

        valid = false;
      }

      // Password validation
      if (fieldId === "password" && value.length < 6) {
        showFieldError(fieldId, "Password must be at least 6 characters.");

        valid = false;
      }
    });

    return valid;
  }

  /*
   * Mock sign-in
   *
   * Replace this function with your real backend/API later.
   */
  function submitLogin(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          token: "demo-token-" + Date.now(),
          role: payload.role,
        });
      }, 700);
    });
  }

  /*
   * Login form submit
   */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearFormStatus();

      // Validate form
      if (!validate()) {
        setFormStatus("Please fix the highlighted fields.", "error");

        return;
      }

      const cfg = ROLES[currentRole];

      // Create payload
      const payload = {
        role: currentRole,
      };

      cfg.requiredFields.forEach((fieldId) => {
        const input = document.getElementById(fieldId);

        if (input) {
          payload[fieldId] = input.value.trim();
        }
      });

      // Remember me
      const rememberCheckbox = document.getElementById("remember");

      payload.remember = rememberCheckbox ? rememberCheckbox.checked : false;

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      if (submitLabel) {
        submitLabel.textContent = "Signing in…";
      }

      try {
        const result = await submitLogin(payload);

        if (result.ok) {
          /*
           * Demo session storage
           *
           * Replace this with your real
           * authentication/session system later.
           */
          const storage = payload.remember ? localStorage : sessionStorage;

          storage.setItem(
            "clubops_session",
            JSON.stringify({
              role: result.role,
              token: result.token,
            }),
          );

          setFormStatus(
            `Signed in as ${ROLES[currentRole].label}. Redirecting…`,
            "success",
          );

          /*
           * Dashboard redirect
           *
           * Uncomment this when your dashboard
           * routing is ready.
           *
           * window.location.href =
           *   "./dashboard.html";
           */
        } else {
          setFormStatus(
            "Sign-in failed. Check your details and try again.",
            "error",
          );
        }
      } catch (err) {
        console.error("Login error:", err);

        setFormStatus("Something went wrong. Please try again.", "error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }

        if (submitLabel) {
          submitLabel.textContent = ROLES[currentRole].submitLabel;
        }
      }
    });
  }

  /*
   * Forgot password
   */
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();

      setFormStatus(
        "Password reset isn't wired up yet — link this to your reset flow.",
        "error",
      );
    });
  }

  /*
   * IMPORTANT:
   *
   * There is intentionally NO event listener
   * for #signupLink.
   *
   * The HTML link:
   *
   * <a href="./signup.html" id="signupLink">
   *   Create an account
   * </a>
   *
   * will work normally.
   */

  /*
   * Initialize page
   */
  setRole("student");
})();
