document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("dossierApp");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        appEl.style.display = "block";
    } else {
        lockedEl.style.display = "block";
        appEl.style.display = "none";
    }
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

document.querySelectorAll(".notesToggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
        const notes = toggle.nextElementSibling;
        const isOpen = notes.style.display === "block";
        notes.style.display = isOpen ? "none" : "block";
        toggle.textContent = isOpen ? "▸ internal notes" : "▾ internal notes";
    });
});

});
