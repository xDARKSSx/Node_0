/* =========================
   FIREBASE INIT
========================= */
const firebaseConfig = {
    databaseURL: "https://node-0-26139-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.state = {};
window.ready = false;

/* =========================
   SHARED TIMER (30 DAYS)
   The first visitor triggers the start
   on the Firebase server side. Everyone
   then sees the exact same countdown.
========================= */
const TIMER_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

db.ref("world").transaction(current => {
    if (current === null || current.timerStart === undefined) {
        return {
            ...(current || {}),
            timerStart: firebase.database.ServerValue.TIMESTAMP,
            timerDuration: TIMER_DURATION_SECONDS,
            chapter: (current && current.chapter) || 1
        };
    }
    return current; // already initialized, leave it alone
});

/* =========================
   CONTINUOUS SYNC
========================= */
db.ref("/").on("value", snap => {
    window.state = snap.val() || {};
    window.ready = true;
    document.dispatchEvent(new CustomEvent("state-updated"));
});

/* =========================
   HELPERS
========================= */
window.getTimeLeft = function () {
    if (!window.ready) return null;
    const w = window.state.world;
    if (!w || !w.timerStart || !w.timerDuration) return null;
    const endMs = w.timerStart + (w.timerDuration * 1000);
    return Math.floor((endMs - Date.now()) / 1000);
};

window.getChapter = function () {
    if (!window.ready) return 1;
    return (window.state.world && window.state.world.chapter) || 1;
};

/* =========================
   ARG TRIGGERS (global progression)
   Only one of these blocks needs to fire
   to trigger the event for EVERYONE, no
   matter who's online at that moment.
========================= */
setInterval(() => {
    const left = window.getTimeLeft();
    if (left === null) return;
    const day = 86400;

    // Example: at 15 days left, trigger a narrative layer
    if (left < 15 * day && !window.state.world?.layer2Triggered) {
        db.ref("world/layer2Triggered").set(true);
    }

    // Timer ends -> automatic move to next chapter for everyone
    if (left <= 0 && !window.state.world?.layer3Triggered) {
        db.ref("world/layer3Triggered").set(true);
        db.ref("world/chapter").set((window.getChapter() || 1) + 1);
    }
}, 3000);

/* =========================
   MANUAL CHAPTER UNLOCK
   (call this later from the console,
   or from a "puzzle solved" system)
   Example: window.unlockNextChapter()
========================= */
window.unlockNextChapter = function () {
    db.ref("world/chapter").set((window.getChapter() || 1) + 1);
};
