/* ================= SIDEBAR ================= */

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

/* ================= AI MODAL ================= */

const aiModal = document.getElementById("aiModal");
const askAiBtn = document.getElementById("askAiBtn");
const closeAi = document.getElementById("closeAi");
const sendAi = document.getElementById("sendAi");
const aiQuestion = document.getElementById("aiQuestion");

askAiBtn.addEventListener("click", () => {
  aiModal.classList.add("show");
  aiQuestion.focus();
});

closeAi.addEventListener("click", () => {
  aiModal.classList.remove("show");
});

aiModal.addEventListener("click", (event) => {
  if (event.target === aiModal) {
    aiModal.classList.remove("show");
  }
});

/* ================= AI QUESTION ================= */

sendAi.addEventListener("click", askQuestion);

aiQuestion.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    askQuestion();
  }
});

function askQuestion() {
  const question = aiQuestion.value.trim();

  if (question === "") {
    alert("Please enter a question.");
    return;
  }

  alert(
    "ClubOps AI received your question:\n\n" +
      question +
      "\n\nAI backend can be connected here.",
  );

  aiQuestion.value = "";
}

/* ================= AI SUGGESTIONS ================= */

const suggestions = document.querySelectorAll(".ai-suggestions button");

suggestions.forEach((button) => {
  button.addEventListener("click", () => {
    aiQuestion.value = button.textContent;

    aiQuestion.focus();
  });
});

/* ================= TASK CHECKBOX ================= */

const taskCheckboxes = document.querySelectorAll(".task-check input");

taskCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const task = checkbox.closest(".task-item");

    const title = task.querySelector(".task-details strong");

    if (checkbox.checked) {
      title.style.textDecoration = "line-through";
      title.style.color = "#9ca3af";
    } else {
      title.style.textDecoration = "none";
      title.style.color = "#1f2937";
    }
  });
});

/* ================= SEARCH ================= */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const tasks = document.querySelectorAll(".task-item");

  tasks.forEach((task) => {
    const title = task
      .querySelector(".task-details strong")
      .textContent.toLowerCase();

    if (title.includes(value)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

/* ================= CREATE BUTTON ================= */

const createBtn = document.getElementById("createBtn");

createBtn.addEventListener("click", () => {
  alert(
    "Create menu\n\n" +
      "• New Task\n" +
      "• New Event\n" +
      "• Add Volunteer\n" +
      "• Schedule Meeting\n" +
      "• Upload Document",
  );
});

/* ================= NOTIFICATION ================= */

const notificationBtn = document.getElementById("notificationBtn");

notificationBtn.addEventListener("click", () => {
  alert(
    "Notifications\n\n" +
      "• 3 tasks need attention\n" +
      "• Volunteer briefing tomorrow\n" +
      "• Sponsor meeting scheduled",
  );
});

// ============================================
// LOGGED-IN USER
// ============================================

function getLoggedInUser() {
  const storedUser =
    localStorage.getItem("clubops_user") ||
    sessionStorage.getItem("clubops_user");

  if (!storedUser) {
    // No logged-in user
    window.location.href = "login.html";
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("clubops_user");
    sessionStorage.removeItem("clubops_user");

    window.location.href = "login.html";

    return null;
  }
}

// ============================================
// GET USER INITIALS
// ============================================

function getInitials(fullName) {
  if (!fullName) {
    return "U";
  }

  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  return (
    nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
  ).toUpperCase();
}

// ============================================
// GET ROLE NAME
// ============================================

function getRoleName(role) {
  const roles = {
    student: "Student",
    head: "Club Head",
    volunteer: "Volunteer",
  };

  return roles[role] || role || "User";
}

// ============================================
// GET GREETING
// ============================================

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

// ============================================
// DISPLAY USER
// ============================================

function displayLoggedInUser() {
  const user = getLoggedInUser();

  if (!user) {
    return;
  }

  const fullName = user.full_name || "User";
  const initials = getInitials(fullName);
  const roleName = getRoleName(user.role);

  // ------------------------------------------
  // Welcome message
  // ------------------------------------------

  const welcomeMessage = document.getElementById("welcomeMessage");

  if (welcomeMessage) {
    welcomeMessage.innerHTML = `${getGreeting()}, ${fullName} <span>👋</span>`;
  }

  // ------------------------------------------
  // Sidebar name
  // ------------------------------------------

  const sidebarUserName = document.getElementById("sidebarUserName");

  if (sidebarUserName) {
    sidebarUserName.textContent = fullName;
  }

  // ------------------------------------------
  // Sidebar role
  // ------------------------------------------

  const sidebarUserRole = document.getElementById("sidebarUserRole");

  if (sidebarUserRole) {
    sidebarUserRole.textContent = roleName;
  }

  // ------------------------------------------
  // Sidebar avatar
  // ------------------------------------------

  const userAvatar = document.getElementById("userAvatar");

  if (userAvatar) {
    userAvatar.textContent = initials;
  }

  // ------------------------------------------
  // Top avatar
  // ------------------------------------------

  const topAvatar = document.getElementById("topAvatar");

  if (topAvatar) {
    topAvatar.textContent = initials;
  }

  // ------------------------------------------
  // Current date
  // ------------------------------------------

  const currentDate = document.getElementById("currentDate");

  if (currentDate) {
    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}

// ============================================
// RUN WHEN PAGE LOADS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  displayLoggedInUser();
});

welcomeMessage.textContent = `${getGreeting()}, ${user.full_name} 👋`;
