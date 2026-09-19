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
