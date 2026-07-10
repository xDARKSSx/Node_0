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
   INIT (juste le chapitre, plus de minuteur)
========================= */
db.ref("world").transaction(current => {
    if (current === null || current.chapter === undefined) {
        return {
            ...(current || {}),
            chapter: (current && current.chapter) || 1
        };
    }
    return current; // déjà initialisé, on ne touche à rien
});

/* =========================
   SYNC EN CONTINU
========================= */
db.ref("/").on("value", snap => {
    window.state = snap.val() || {};
    window.ready = true;
    document.dispatchEvent(new CustomEvent("state-updated"));
});

/* =========================
   HELPERS
========================= */
window.getChapter = function () {
    if (!window.ready) return 1;
    return (window.state.world && window.state.world.chapter) || 1;
};

/* =========================
   DÉBLOCAGE MANUEL D'UN CHAPITRE
   (appelé par les systèmes d'énigme résolue)
   Exemple : window.unlockNextChapter()
========================= */
window.unlockNextChapter = function () {
    db.ref("world/chapter").set((window.getChapter() || 1) + 1);
};
