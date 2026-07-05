const firebaseConfig = {
    databaseURL: "https://node-0-26139-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

window.state = null;
window.ready = false;

db.ref("/").on("value", (snap) => {
    window.state = snap.val() || {};
    window.ready = true;
});

////////////////////////////////////////////////////
// SAFE TIMER (NE PEUT PAS FAIL)
////////////////////////////////////////////////////
window.getTimeLeft = function(){

    if(!window.ready) return null;

    const world = window.state?.world;
    if(!world) return null;

    if(world.timerStart == null || world.timerDuration == null) return null;

    const now = Math.floor(Date.now() / 1000);

    return (world.timerStart + world.timerDuration) - now;
};

////////////////////////////////////////////////////
// TIMER TRIGGERS
////////////////////////////////////////////////////
setInterval(() => {

    const left = window.getTimeLeft();
    if(left === null) return;

    const day = 86400;

    if(left < 15 * day && !window.state?.world?.layer2Triggered){
        db.ref("world/layer2Triggered").set(true);
    }

    if(left <= 0 && !window.state?.world?.layer3Triggered){
        db.ref("world/layer3Triggered").set(true);
        db.ref("chapter").set((window.state.chapter || 1) + 1);
    }

}, 3000);
