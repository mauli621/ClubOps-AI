/* =========================================================
   ANNOUNCEMENTS PAGE — page-specific behavior
   Assumes js/dashboard.js already wires up the shared chrome:
   #menuBtn (sidebar toggle), #notificationBtn, and the AI modal
   (#askAiBtn opens #aiModal, #closeAi closes it, #sendAi / the
   .ai-suggestions buttons drive #aiQuestion). This file only
   handles what's specific to Announcements.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* ---------------------------------------------------------
     Feed filter pills
     --------------------------------------------------------- */
  const filterPills = document.querySelectorAll(".filter-pill");
  const annCards = document.querySelectorAll(".ann-card");
  const feedFilter = document.getElementById("feedFilter");

  function applyAudienceFilter(value) {
    annCards.forEach((card) => {
      const audience = card.dataset.audience;
      const pinned = card.dataset.pinned === "true";

      let show = true;
      if (value === "pinned") show = pinned;
      else if (value && value !== "all") show = audience === value;

      card.style.display = show ? "flex" : "none";
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      applyAudienceFilter(pill.dataset.audience || "all");
    });
  });

  if (feedFilter) {
    feedFilter.addEventListener("change", () => {
      const map = {
        "All audiences": "all",
        Students: "student",
        "Committee heads": "head",
        Volunteers: "volunteer",
        "Pinned only": "pinned",
      };
      const value = map[feedFilter.value] || "all";
      applyAudienceFilter(value);

      filterPills.forEach((p) => p.classList.remove("active"));
      const match = Array.from(filterPills).find(
        (p) => (p.dataset.audience || "all") === value,
      );
      if (match) match.classList.add("active");
    });
  }

  /* ---------------------------------------------------------
     Per-card actions: pin / unpin / edit / delete
     --------------------------------------------------------- */
  annCards.forEach((card) => {
    const footerButtons = card.querySelectorAll(".ann-footer button");

    footerButtons.forEach((btn) => {
      const label = btn.textContent.trim().toLowerCase();

      btn.addEventListener("click", () => {
        if (label.includes("pin") || label.includes("unpin")) {
          const nowPinned = card.dataset.pinned !== "true";
          card.dataset.pinned = String(nowPinned);

          const pinIcon = card.querySelector(".ann-pin");
          const icon = btn.querySelector("i");

          if (nowPinned) {
            if (!pinIcon) {
              const i = document.createElement("i");
              i.className = "fa-solid fa-thumbtack ann-pin";
              card.querySelector(".ann-top-row").appendChild(i);
            }
            btn.innerHTML = '<i class="fa-solid fa-thumbtack"></i>Unpin';
            showToast("Announcement pinned");
          } else {
            if (pinIcon) pinIcon.remove();
            btn.innerHTML = '<i class="fa-solid fa-thumbtack"></i>Pin';
            showToast("Announcement unpinned");
          }
        } else if (label.includes("delete")) {
          card.style.opacity = "0";
          card.style.transition = "opacity 0.2s ease";
          setTimeout(() => card.remove(), 200);
          showToast("Announcement deleted");
        } else if (label.includes("edit")) {
          const title = card.querySelector(".ann-title-block strong");
          const body = card.querySelector(".ann-text");
          const titleField = document.getElementById("annTitle");
          const messageField = document.getElementById("annMessage");

          if (titleField && title) titleField.value = title.textContent.trim();
          if (messageField && body) messageField.value = body.textContent.trim();

          document
            .getElementById("composePanel")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  });

  /* ---------------------------------------------------------
     Composer: audience chips (multi-select)
     --------------------------------------------------------- */
  document.querySelectorAll(".audience-chip").forEach((chip) => {
    chip.addEventListener("click", () => chip.classList.toggle("on"));
  });

  /* ---------------------------------------------------------
     Composer: priority chips (single-select)
     --------------------------------------------------------- */
  const priorityChips = document.querySelectorAll(".priority-chip");
  priorityChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      priorityChips.forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
    });
  });

  /* ---------------------------------------------------------
     Composer: draft / publish
     --------------------------------------------------------- */
  const draftBtn = document.getElementById("draftBtn");
  const publishBtn = document.getElementById("publishBtn");
  const annTitle = document.getElementById("annTitle");

  draftBtn?.addEventListener("click", () => {
    showToast("Draft saved");
  });

  publishBtn?.addEventListener("click", () => {
    const titleValue = annTitle?.value.trim();
    showToast(
      titleValue ? `"${titleValue}" published` : "Announcement published",
    );
    if (annTitle) annTitle.value = "";
    const message = document.getElementById("annMessage");
    if (message) message.value = "";
  });

  /* ---------------------------------------------------------
     Top "New Announcement" button + quick actions
     --------------------------------------------------------- */
  document.getElementById("createBtn")?.addEventListener("click", () => {
    document
      .getElementById("composePanel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    annTitle?.focus();
  });

  document.getElementById("qaCompose")?.addEventListener("click", () => {
    document
      .getElementById("composePanel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    annTitle?.focus();
  });

  document.getElementById("qaAskAi")?.addEventListener("click", () => {
    document.getElementById("askAiBtn")?.click();
  });
});
