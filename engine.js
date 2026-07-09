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
   TIMER PARTAGÉ (30 JOURS)
   Le premier visiteur déclenche le départ
   côté serveur Firebase. Tout le monde
   voit ensuite le même compte à rebours.
========================= */
const TIMER_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 jours

db.ref("world").transaction(current => {
    if (current === null || current.timerStart === undefined) {
        return {
            ...(current || {}),
            timerStart: firebase.database.ServerValue.TIMESTAMP,
            timerDuration: TIMER_DURATION_SECONDS,
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
   TRIGGERS ARG (progression globale)
   Un seul de ces blocs suffit à déclencher
   l'event pour TOUT LE MONDE, peu importe
   qui est en ligne au moment T.
========================= */
setInterval(() => {
    const left = window.getTimeLeft();
    if (left === null) return;
    const day = 86400;

    // Exemple : à 15 jours restants, on déclenche une couche narrative (pur habillage, ne touche pas au chapitre)
    if (left < 15 * day && !window.state.world?.layer2Triggered) {
        db.ref("world/layer2Triggered").set(true);
    }

    // Fin du minuteur : habillage narratif seulement (NE force plus le chapitre,
    // la progression réelle passe uniquement par les énigmes résolues)
    if (left <= 0 && !window.state.world?.layer3Triggered) {
        db.ref("world/layer3Triggered").set(true);
    }
}, 3000);

/* =========================
   DÉBLOCAGE MANUEL D'UN CHAPITRE
   (à appeler plus tard depuis la console,
   ou depuis un système d'énigme résolue)
   Exemple : window.unlockNextChapter()
========================= */
window.unlockNextChapter = function () {
    db.ref("world/chapter").set((window.getChapter() || 1) + 1);
};
