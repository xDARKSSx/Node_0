document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const appEl = document.getElementById("dossierApp");

function updateVisibility() {
    if (window.getChapter() >= 4) {
        lockedEl.style.display = "none";
        appEl.style.display = "block";
        checkFragmentEntries();
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

/* =========================
   LIVE "NEW ENTRY" SYSTEM
   Each solved fragment appends a real-timestamped
   entry to that person's dossier -- collectively,
   these build toward a larger combined phrase.
========================= */
function formatRealTimestamp(ms) {
    const d = new Date(ms);
    return d.toLocaleString(undefined, {
        weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit"
    });
}

function injectEntry(containerId, timestamp, clueText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.querySelector(".newEntry")) return; // already injected

    const entry = document.createElement("div");
    entry.className = "newEntry";
    entry.style.marginTop = "14px";
    entry.style.paddingTop = "12px";
    entry.style.borderTop = "1px dashed #ffffff33";
    entry.style.color = "#ff9f4a";
    entry.innerHTML = `NEW ENTRY — ${formatRealTimestamp(timestamp)}<br>External access to subject's personal disclosure detected. Compiler's note: <strong>${clueText}</strong>`;
    container.appendChild(entry);
}

function checkFragmentEntries() {
    const w = window.state && window.state.world;
    if (!w) return;

    if (w.davidFragmentFoundAt) {
        injectEntry("notes-david", w.davidFragmentFoundAt, "THEY");
    }
    if (w.sarahFragmentFoundAt) {
        injectEntry("notes-sarah", w.sarahFragmentFoundAt, "WERE");
    }
    if (w.marcusFragmentFoundAt) {
        injectEntry("notes-marcus", w.marcusFragmentFoundAt, "NEVER");
    }
}

});
