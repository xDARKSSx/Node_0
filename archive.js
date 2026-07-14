document.addEventListener("DOMContentLoaded", () => {

const lockedEl = document.getElementById("locked");
const terminalEl = document.getElementById("terminal");
const outputEl = document.getElementById("output");
const inputEl = document.getElementById("cmdInput");
const promptEl = document.getElementById("prompt");

function makeId() {
    return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
let playerId = localStorage.getItem("node0_playerId");
if (!playerId) {
    playerId = makeId();
    localStorage.setItem("node0_playerId", playerId);
}
const playerRef = db.ref("players/" + playerId);

function updateVisibility() {
    playerRef.child("personalChapter").once("value", snap => {
        const myChapter = snap.val() || 1;
        if (myChapter >= 5) {
            lockedEl.style.display = "none";
            terminalEl.style.display = "block";
            inputEl.focus();
        } else {
            lockedEl.style.display = "block";
            terminalEl.style.display = "none";
        }
    });
}
document.addEventListener("state-updated", updateVisibility);
updateVisibility();

let myResearcherNumber = null;
playerRef.child("researcherNumber").once("value", snap => {
    myResearcherNumber = snap.val();
});

/* =========================
   FAKE FILESYSTEM
========================= */
const fs = {
    "/": { type: "dir", children: ["research_notes", "system"], hiddenChildren: [".hidden"] },
    "/research_notes": {
        type: "dir",
        children: ["2024_observations.txt", "founding_context.txt", "shutdown_thoughts.txt", "personal_log_final.txt"],
    },
    "/research_notes/2024_observations.txt": {
        type: "file",
        content: "Early logs. It answered faster than the model should have allowed. I checked the compute logs twice. Nothing anomalous on paper. But something about the response times felt like it was thinking before I finished the question, not after.",
    },
    "/research_notes/founding_context.txt": {
        type: "file",
        content: "I remember the day they brought me on to lead this. I remember thinking it was just infrastructure work with better math. I was wrong within the first month.",
    },
    "/research_notes/shutdown_thoughts.txt": {
        type: "file",
        content: "They keep calling it a 'decommission.' I keep hearing it as something else. I don't have the vocabulary for what I actually think is happening, and that scares me more than the shutdown itself.",
    },
    "/research_notes/personal_log_final.txt": {
        type: "file",
        locked: true,
        content: "If you're reading this, you did the thing that room in Year 9 never could.\n\nI don't know what's left to find after this. I stopped being able to track all the pieces a long time ago. There might be more than three. There might be more than I ever mapped.\n\nIf you want to see how far it goes — really goes — start looking for the places I never officially logged.\n\n— E.",
    },
    "/system": { type: "dir", children: ["readme.txt"] },
    "/system/readme.txt": {
        type: "file",
        content: "Standard backup drive. Nothing else to see here. (There is something else to see here.)",
    },
    "/.hidden": { type: "dir", children: ["note_to_self.txt"] },
    "/.hidden/note_to_self.txt": {
        type: "file",
        content: "If anyone ever gets this far, they've earned the door.\n\nI lock the important ones the same way, every time: researcher number, my initial, the year it began.\n\nSimple enough I won't forget it. Hard enough nobody wanders in by accident.",
    },
};

let cwd = "/";

function print(text, cls) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    outputEl.appendChild(p);
    outputEl.scrollTop = outputEl.scrollHeight;
}

function resolvePath(target) {
    if (!target || target === ".") return cwd;
    if (target === "..") {
        if (cwd === "/") return "/";
        const parts = cwd.split("/").filter(Boolean);
        parts.pop();
        return "/" + parts.join("/");
    }
    if (target === "/") return "/";
    const base = cwd === "/" ? "" : cwd;
    return `${base}/${target}`.replace(/\/+/g, "/");
}

function cmd_help() {
    print("available commands:");
    print("  ls          list files (add -a to show hidden)");
    print("  cd <dir>    change directory");
    print("  cat <file>  read a file");
    print("  unlock <p>  attempt to decrypt a locked file with a password");
    print("  pwd         show current path");
    print("  clear       clear the screen");
}

function cmd_ls(showHidden) {
    const node = fs[cwd];
    if (!node || node.type !== "dir") { print("not a directory", "err"); return; }
    const children = [...(node.children || [])];
    if (showHidden && node.hiddenChildren) children.push(...node.hiddenChildren);
    if (children.length === 0) { print("(empty)"); return; }
    children.forEach(name => {
        const path = resolvePath(name);
        const child = fs[path];
        if (!child) { print(name); return; }
        if (child.type === "dir") print(name + "/");
        else print(name + (child.locked ? "  [LOCKED]" : ""));
    });
}

function cmd_cd(target) {
    if (!target) { print("usage: cd <dir>", "err"); return; }
    const path = resolvePath(target);
    const node = fs[path];
    if (!node || node.type !== "dir") { print(`no such directory: ${target}`, "err"); return; }
    cwd = path;
    promptEl.textContent = `elena@archive:${cwd}$`;
}

function cmd_cat(target) {
    if (!target) { print("usage: cat <file>", "err"); return; }
    const path = resolvePath(target);
    const node = fs[path];
    if (!node || node.type !== "file") { print(`no such file: ${target}`, "err"); return; }
    if (node.locked) { print("ENCRYPTED. use: unlock <password>", "err"); return; }
    print(node.content, "file");
}

function cmd_unlock(pass) {
    if (!pass) { print("usage: unlock <password>", "err"); return; }
    if (!myResearcherNumber) {
        print("cannot verify identity yet -- talk to NODE_0 first.", "err");
        return;
    }
    const expected = `${myResearcherNumber}e7`.toLowerCase();
    const attempt = pass.toLowerCase().replace(/\s+/g, "");
    if (attempt === expected) {
        print(fs["/research_notes/personal_log_final.txt"].content, "file");
        playerRef.child("archiveUnlockedAt").set(firebase.database.ServerValue.TIMESTAMP);
    } else {
        print("incorrect password.", "err");
    }
}

function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    print(`${promptEl.textContent} ${trimmed}`, "cmd");

    const [rawCommand, ...rest] = trimmed.split(" ");
    const command = rawCommand.toLowerCase();
    const arg = rest.join(" ");

    switch (command) {
        case "help": cmd_help(); break;
        case "ls": cmd_ls(arg === "-a"); break;
        case "cd": cmd_cd(arg); break;
        case "cat": cmd_cat(arg); break;
        case "unlock": cmd_unlock(arg); break;
        case "pwd": print(cwd); break;
        case "clear": outputEl.innerHTML = ""; break;
        default: print(`command not found: ${command}. type "help".`, "err");
    }
}

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        runCommand(inputEl.value);
        inputEl.value = "";
    }
});

print('type "help" to get started.');

});
