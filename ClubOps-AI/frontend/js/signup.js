const API_URL = "http://127.0.0.1:5000";

const ROLES = {
  student: {
    label: "Student",
    buttonText: "Create Student account",
    requiredFields: [
      "fullName",
      "rollNo",
      "department",
      "email",
      "password",
      "confirmPassword",
    ],
    features: [
      "Join and participate in club events",
      "Track your tasks and responsibilities",
      "Stay connected with your club",
    ],
  },

  head: {
    label: "Club Head",
    buttonText: "Create Club Head account",
    requiredFields: [
      "fullName",
      "clubName",
      "clubCategory",
      "email",
      "password",
      "confirmPassword",
    ],
    features: [
      "Manage your club and members",
      "Create and organize events",
      "Assign tasks and track progress",
    ],
  },

  volunteer: {
    label: "Volunteer",
    buttonText: "Create Volunteer account",
    requiredFields: [
      "fullName",
      "phone",
      "interest",
      "email",
      "password",
      "confirmPassword",
    ],
    features: [
      "Support club events",
      "Manage assigned responsibilities",
      "Work with your event team",
    ],
  },
};

let currentRole = "student";

const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const submitLabel = document.getElementById("submitLabel");
const formStatus = document.getElementById("formStatus");
const brandRoleLabel = document.getElementById("brandRoleLabel");
const brandFeatures = document.getElementById("brandFeatures");

const roleTabs = document.querySelectorAll(".role-tab");
const conditionalFields = document.querySelectorAll(".field--conditional");

// --------------------------------------------------
// GET ELEMENT
// --------------------------------------------------

function getField(id) {
  return document.getElementById(id);
}

// --------------------------------------------------
// ERROR FUNCTIONS
// --------------------------------------------------

function showError(fieldId, message) {
  const field = getField(fieldId);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);

  if (field) {
    field.classList.add("input-error");
  }

  if (error) {
    error.textContent = message;
  }
}

function clearError(fieldId) {
  const field = getField(fieldId);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);

  if (field) {
    field.classList.remove("input-error");
  }

  if (error) {
    error.textContent = "";
  }
}

function clearAllErrors() {
  document.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("input-error");
  });

  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function setFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

// --------------------------------------------------
// ROLE SWITCHING
// --------------------------------------------------

function updateRole(role) {
  currentRole = role;

  const config = ROLES[role];

  // Update tabs
  roleTabs.forEach((tab) => {
    const isActive = tab.dataset.role === role;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // Show/hide role-specific fields
  conditionalFields.forEach((field) => {
    const fieldRole = field.dataset.for;

    field.hidden = fieldRole !== role;
  });

  // Update left panel
  brandRoleLabel.textContent = config.label;

  brandFeatures.innerHTML = "";

  config.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    brandFeatures.appendChild(li);
  });

  // Update submit button
  submitLabel.textContent = config.buttonText;

  // Clear errors when changing role
  clearAllErrors();
}

// --------------------------------------------------
// ROLE TAB CLICK
// --------------------------------------------------

roleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    updateRole(tab.dataset.role);
  });
});

// --------------------------------------------------
// PASSWORD TOGGLE
// --------------------------------------------------

function setupPasswordToggle(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);

  if (!button || !input) return;

  button.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "Hide";
      button.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      button.textContent = "Show";
      button.setAttribute("aria-label", "Show password");
    }
  });
}

setupPasswordToggle("togglePw", "password");
setupPasswordToggle("toggleConfirmPw", "confirmPassword");

// --------------------------------------------------
// VALIDATION HELPERS
// --------------------------------------------------

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidName(name) {
  return /^[A-Za-z\s.'-]+$/.test(name);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

// --------------------------------------------------
// VALIDATE FORM
// --------------------------------------------------

function validateForm() {
  let valid = true;

  clearAllErrors();

  const fullName = getField("fullName").value.trim();
  const rollNo = getField("rollNo").value.trim();
  const department = getField("department").value.trim();

  const clubName = getField("clubName").value.trim();
  const clubCategory = getField("clubCategory").value.trim();

  const phone = getField("phone").value.trim();
  const interest = getField("interest").value.trim();

  const email = getField("email").value.trim();
  const password = getField("password").value;
  const confirmPassword = getField("confirmPassword").value;

  const terms = getField("terms").checked;

  // ----------------------------------------------
  // FULL NAME
  // ----------------------------------------------

  if (!fullName) {
    showError("fullName", "Full name is required.");
    valid = false;
  } else if (fullName.length < 2) {
    showError("fullName", "Name must contain at least 2 characters.");
    valid = false;
  } else if (fullName.length > 100) {
    showError("fullName", "Name must not exceed 100 characters.");
    valid = false;
  } else if (!isValidName(fullName)) {
    showError(
      "fullName",
      "Name can contain only letters, spaces, dots, apostrophes and hyphens.",
    );
    valid = false;
  }

  // ----------------------------------------------
  // STUDENT VALIDATION
  // ----------------------------------------------

  if (currentRole === "student") {
    if (!rollNo) {
      showError("rollNo", "Roll number is required.");
      valid = false;
    } else if (rollNo.length > 50) {
      showError("rollNo", "Roll number is too long.");
      valid = false;
    }

    if (!department) {
      showError("department", "Department / year is required.");
      valid = false;
    } else if (department.length < 2) {
      showError("department", "Please enter a valid department or year.");
      valid = false;
    }
  }

  // ----------------------------------------------
  // CLUB HEAD VALIDATION
  // ----------------------------------------------

  if (currentRole === "head") {
    if (!clubName) {
      showError("clubName", "Club name is required.");
      valid = false;
    } else if (clubName.length < 2) {
      showError("clubName", "Club name must contain at least 2 characters.");
      valid = false;
    }

    if (!clubCategory) {
      showError("clubCategory", "Club category is required.");
      valid = false;
    }
  }

  // ----------------------------------------------
  // VOLUNTEER VALIDATION
  // ----------------------------------------------

  if (currentRole === "volunteer") {
    if (!phone) {
      showError("phone", "Phone number is required.");
      valid = false;
    } else if (!isValidPhone(phone.replace(/\s/g, ""))) {
      showError("phone", "Enter a valid 10-digit phone number.");
      valid = false;
    }

    if (!interest) {
      showError("interest", "Area of interest is required.");
      valid = false;
    }
  }

  // ----------------------------------------------
  // EMAIL
  // ----------------------------------------------

  if (!email) {
    showError("email", "Email address is required.");
    valid = false;
  } else if (!isValidEmail(email)) {
    showError("email", "Enter a valid email address.");
    valid = false;
  } else if (email.length > 150) {
    showError("email", "Email address is too long.");
    valid = false;
  }

  // ----------------------------------------------
  // PASSWORD
  // ----------------------------------------------

  if (!password) {
    showError("password", "Password is required.");
    valid = false;
  } else if (password.length < 6) {
    showError("password", "Password must contain at least 6 characters.");
    valid = false;
  } else if (password.length > 100) {
    showError("password", "Password must not exceed 100 characters.");
    valid = false;
  }

  // ----------------------------------------------
  // CONFIRM PASSWORD
  // ----------------------------------------------

  if (!confirmPassword) {
    showError("confirmPassword", "Please confirm your password.");
    valid = false;
  } else if (password !== confirmPassword) {
    showError("confirmPassword", "Passwords do not match.");
    valid = false;
  }

  // ----------------------------------------------
  // TERMS
  // ----------------------------------------------

  if (!terms) {
    showError("terms", "You must agree to the club's code of conduct.");
    valid = false;
  }

  return valid;
}

// --------------------------------------------------
// SUBMIT SIGNUP
// --------------------------------------------------

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Validate before sending data to backend
  if (!validateForm()) {
    setFormStatus("Please fix the highlighted fields.", "error");

    return;
  }

  const fullName = getField("fullName").value.trim();
  const rollNo = getField("rollNo").value.trim();
  const department = getField("department").value.trim();

  const clubName = getField("clubName").value.trim();
  const clubCategory = getField("clubCategory").value.trim();

  const phone = getField("phone").value.trim().replace(/\s/g, "");
  const interest = getField("interest").value.trim();

  const email = getField("email").value.trim();
  const password = getField("password").value;

  // ----------------------------------------------
  // DATA SENT TO FLASK
  // ----------------------------------------------

  const payload = {
    role: currentRole,
    full_name: fullName,

    roll_no: currentRole === "student" ? rollNo : null,

    department: currentRole === "student" ? department : null,

    club_name: currentRole === "head" ? clubName : null,

    club_category: currentRole === "head" ? clubCategory : null,

    phone: currentRole === "volunteer" ? phone : null,

    interest: currentRole === "volunteer" ? interest : null,

    email: email,
    password: password,
    terms_accepted: true,
  };

  // ----------------------------------------------
  // BUTTON LOADING
  // ----------------------------------------------

  submitBtn.disabled = true;
  submitLabel.textContent = "Creating account...";

  setFormStatus("", "");

  try {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to create account.");
    }

    // --------------------------------------------
    // SUCCESS
    // --------------------------------------------

    setFormStatus(
      "Account created successfully! Redirecting to login...",
      "success",
    );

    form.reset();

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1000);
  } catch (error) {
    console.error("Signup error:", error);

    setFormStatus(error.message || "Unable to connect to the server.", "error");
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = ROLES[currentRole].buttonText;
  }
});

// --------------------------------------------------
// CLEAR ERROR WHEN USER STARTS TYPING
// --------------------------------------------------

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", () => {
    clearError(input.id);

    if (formStatus.classList.contains("error")) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }
  });
});

// --------------------------------------------------
// TERMS CHECKBOX
// --------------------------------------------------

getField("terms").addEventListener("change", () => {
  clearError("terms");
});

// --------------------------------------------------
// PHONE: ALLOW ONLY NUMBERS
// --------------------------------------------------

getField("phone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
});

// --------------------------------------------------
// INITIAL ROLE
// --------------------------------------------------

updateRole("student");
