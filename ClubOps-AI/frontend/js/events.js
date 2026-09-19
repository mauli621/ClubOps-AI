const eventModal = document.getElementById("eventModal");
const aiModal = document.getElementById("aiModal");

const createEventBtn = document.getElementById("createEventBtn");
const createEventCard = document.getElementById("createEventCard");

const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const aiPlanBtn = document.getElementById("aiPlanBtn");
const closeAiModal = document.getElementById("closeAiModal");

const eventForm = document.getElementById("eventForm");

const searchInput = document.getElementById("searchInput");

const filterTabs = document.querySelectorAll(".filter-tab");
const eventCards = document.querySelectorAll(".event-card");

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.querySelector(".sidebar");

/* ================= CREATE EVENT MODAL ================= */

function openEventModal() {
  eventModal.classList.add("show");
}

function closeEventModal() {
  eventModal.classList.remove("show");
}

createEventBtn.addEventListener("click", openEventModal);

createEventCard.addEventListener("click", openEventModal);

closeModal.addEventListener("click", closeEventModal);

cancelModal.addEventListener("click", closeEventModal);

/* ================= CREATE EVENT ================= */

eventForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("eventName").value;

  alert(`"${name}" event created successfully!`);

  eventForm.reset();

  closeEventModal();
});

/* ================= AI PLANNER ================= */

aiPlanBtn.addEventListener("click", function () {
  aiModal.classList.add("show");
});

closeAiModal.addEventListener("click", function () {
  aiModal.classList.remove("show");
});

const generatePlan = document.getElementById("generatePlan");

const aiPrompt = document.getElementById("aiPrompt");

const aiResult = document.getElementById("aiResult");

generatePlan.addEventListener("click", function () {
  if (aiPrompt.value.trim() === "") {
    aiPrompt.focus();

    return;
  }

  aiResult.classList.add("show");

  aiResult.innerHTML = `
        <div class="result-loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            Creating your event plan...
        </div>
    `;

  setTimeout(function () {
    aiResult.innerHTML = `
            <strong>AI Event Plan Ready</strong>

            <br><br>

            ✓ Event timeline created<br>
            ✓ 12 tasks generated<br>
            ✓ 6 volunteer roles suggested<br>
            ✓ 4 deadlines identified<br>
            ✓ 2 potential risks detected

            <br><br>

            <strong>Next step:</strong>
            Review the generated plan and assign team members.
        `;
  }, 1500);
});

/* ================= FILTER EVENTS ================= */

filterTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    filterTabs.forEach(function (item) {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    const filter = tab.dataset.filter;

    eventCards.forEach(function (card) {
      const status = card.dataset.status;

      if (filter === "all" || status === filter) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});

/* ================= SEARCH ================= */

searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase().trim();

  eventCards.forEach(function (card) {
    const eventName = card.dataset.name.toLowerCase();

    if (eventName.includes(searchValue)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});

/* ================= VIEW BUTTONS ================= */

const viewButtons = document.querySelectorAll(".view-button");

viewButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const card = button.closest(".event-card");

    const eventName = card.dataset.name;

    alert(`Opening ${eventName}...`);
  });
});

/* ================= MOBILE MENU ================= */

mobileMenu.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

/* ================= CLOSE MODALS ================= */

window.addEventListener("click", function (e) {
  if (e.target === eventModal) {
    closeEventModal();
  }

  if (e.target === aiModal) {
    aiModal.classList.remove("show");
  }
});
