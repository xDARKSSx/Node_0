const firebaseConfig = {
    databaseURL: "https://node-0-26139-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.state = null;

db.ref("/").on("value", (snap) => {
    window.state = snap.val() || {};
});

////////////////////////////////////////////////////
// SAFE TIMER (NO CRASH EVER)
////////////////////////////////////////////////////
window.getTimeLeft = function(){

    const w = window.state?.world;

    if(!w) return null;

    if(!w.timerStart || !w.timerDuration) return null;

    const now = Math.floor(Date.now() / 1000);

    return (w.timerStart + w.timerDuration) - now;
};

////////////////////////////////////////////////////
// SIMPLE CHAPTER EVENTS
////////////////////////////////////////////////////
setInterval(() => {

    if(!window.state) return;

    const left = window.getTimeLeft();
    if(left === null) return;

    const day = 86400;

    if(left < 15 * day && !window.state.world?.layer2Triggered){

        db.ref("world/layer2Triggered").set(true);
    }

    if(left <= 0 && !window.state.world?.layer3Triggered){

        db.ref("world/layer3Triggered").set(true);

        db.ref("chapter").set((window.state.chapter || 1) + 1);
    }

}, 3000);
