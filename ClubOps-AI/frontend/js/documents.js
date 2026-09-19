const uploadModal = document.getElementById("uploadModal");

function uploadDocument() {
  uploadModal.classList.add("show");
}

function closeUpload() {
  uploadModal.classList.remove("show");
}

function processDocument() {
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("Please select a document first.");
    return;
  }

  const fileName = fileInput.files[0].name;

  alert(`"${fileName}" uploaded successfully.\n\nAI processing has started.`);

  closeUpload();
}

/* ================= SEARCH ================= */

function searchDocuments() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const rows = document.querySelectorAll("#documentTable tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();

    row.style.display = text.includes(searchValue) ? "" : "none";
  });
}

/* ================= FILTER ================= */

function filterDocuments() {
  const type = document.getElementById("typeFilter").value;

  const event = document.getElementById("eventFilter").value;

  const rows = document.querySelectorAll("#documentTable tr");

  rows.forEach((row) => {
    const rowType = row.dataset.type;
    const rowEvent = row.dataset.event;

    const typeMatch = type === "all" || rowType === type;

    const eventMatch = event === "all" || rowEvent === event;

    row.style.display = typeMatch && eventMatch ? "" : "none";
  });
}

/* ================= AI ================= */

function openAI() {
  alert("ClubOps AI Assistant is ready.");
}

/* ================= CLOSE MODAL ================= */

window.addEventListener("click", function (event) {
  if (event.target === uploadModal) {
    closeUpload();
  }
});
