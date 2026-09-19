// ClubOps AI — Login page behavior
// Connects login form to Flask + MySQL backend.

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

  // --------------------------------
  // ROLE SWITCHING
  // --------------------------------

  function setRole(role) {
    if (!ROLES[role]) {
      return;
    }

    currentRole = role;

    const cfg = ROLES[role];

    const rootStyles = getComputedStyle(root);

    const accent = rootStyles.getPropertyValue(cfg.accentVar).trim();

    const accentSoft = rootStyles.getPropertyValue(cfg.accentSoftVar).trim();

    root.style.setProperty("--accent", accent);

    root.style.setProperty("--accent-soft", accentSoft);

    // Active tab

    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.role === role;

      tab.classList.toggle("is-active", isActive);

      tab.setAttribute("aria-selected", String(isActive));
    });

    // Show/hide role fields

    conditionalFields.forEach((field) => {
      const show = field.dataset.for === role;

      field.hidden = !show;

      const input = field.querySelector("input");

      if (input) {
        if (!show) {
          input.value = "";
        }

        clearFieldError(input.id);
      }
    });

    // Update left panel

    if (brandRoleLabel) {
      brandRoleLabel.textContent = cfg.label;
    }

    // Update button

    if (submitLabel) {
      submitLabel.textContent = cfg.submitLabel;
    }

    clearFormStatus();
  }

  // --------------------------------
  // ROLE TAB CLICK
  // --------------------------------

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setRole(tab.dataset.role);
    });
  });

  // --------------------------------
  // PASSWORD TOGGLE
  // --------------------------------

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

  // --------------------------------
  // CLEAR ERROR
  // --------------------------------

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

  // --------------------------------
  // SHOW ERROR
  // --------------------------------

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

  // --------------------------------
  // FORM STATUS
  // --------------------------------

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

  function clearFormStatus() {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = "";

    formStatus.classList.remove("is-error", "is-success");
  }

  // --------------------------------
  // EMAIL VALIDATION
  // --------------------------------

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // --------------------------------
  // PHONE VALIDATION
  // --------------------------------

  function isValidPhone(value) {
    return /^[0-9\s+()-]{7,15}$/.test(value);
  }

  // --------------------------------
  // FORM VALIDATION
  // --------------------------------

  function validate() {
    let valid = true;

    const cfg = ROLES[currentRole];

    // Clear old errors

    cfg.requiredFields.forEach((fieldId) => {
      clearFieldError(fieldId);
    });

    // Validate fields

    cfg.requiredFields.forEach((fieldId) => {
      const input = document.getElementById(fieldId);

      if (!input) {
        return;
      }

      const value = input.value.trim();

      // Required

      if (!value) {
        showFieldError(fieldId, "This field is required.");

        valid = false;

        return;
      }

      // Email

      if (fieldId === "email" && !isValidEmail(value)) {
        showFieldError(fieldId, "Enter a valid email address.");

        valid = false;
      }

      // Phone

      if (fieldId === "phone" && !isValidPhone(value)) {
        showFieldError(fieldId, "Enter a valid phone number.");

        valid = false;
      }

      // Password

      if (fieldId === "password" && value.length < 6) {
        showFieldError(fieldId, "Password must be at least 6 characters.");

        valid = false;
      }
    });

    return valid;
  }

  // --------------------------------
  // REAL FLASK LOGIN
  // --------------------------------

  async function submitLogin(payload) {
    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed.");
    }

    return result;
  }

  // --------------------------------
  // LOGIN SUBMIT
  // --------------------------------

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      clearFormStatus();

      // Validate

      if (!validate()) {
        setFormStatus("Please fix the highlighted fields.", "error");

        return;
      }

      const cfg = ROLES[currentRole];

      // Create payload

      const payload = {
        role: currentRole,

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value,
      };

      // Student

      if (currentRole === "student") {
        payload.rollNo = document.getElementById("rollNo").value.trim();
      }

      // Club Head

      if (currentRole === "head") {
        payload.clubName = document.getElementById("clubName").value.trim();
      }

      // Volunteer

      if (currentRole === "volunteer") {
        payload.phone = document.getElementById("phone").value.trim();
      }

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
        // Call Flask

        const result = await submitLogin(payload);

        if (result.success) {
          /*
           * Store logged-in user.
           *
           * Dashboard can use this later.
           */

          const storage = payload.remember ? localStorage : sessionStorage;

          storage.setItem("clubops_user", JSON.stringify(result.user));

          setFormStatus(
            `Welcome ${result.user.full_name}! Redirecting…`,
            "success",
          );

          // Redirect to dashboard

          setTimeout(() => {
            window.location.href = "./dashboard.html";
          }, 700);
        } else {
          setFormStatus(result.message || "Sign-in failed.", "error");
        }
      } catch (err) {
        console.error("Login error:", err);

        setFormStatus(
          err.message || "Unable to connect to the server.",
          "error",
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }

        if (submitLabel) {
          submitLabel.textContent = cfg.submitLabel;
        }
      }
    });
  }

  // --------------------------------
  // FORGOT PASSWORD
  // --------------------------------

  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();

      setFormStatus("Password reset isn't wired up yet.", "error");
    });
  }

  // --------------------------------
  // INITIALIZE
  // --------------------------------

  setRole("student");
})();
