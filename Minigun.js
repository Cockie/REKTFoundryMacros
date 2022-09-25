// Requires the Jack Kerouac's Animated Spell Effects: Cartoon module
// Select a token, then target a set of tokens in any order, and run this macro.
let current_target = canvas.tokens.controlled[0];
let targets = Array.from(game.user.targets);

if (targets.indexOf(current_target) > -1) {
    targets = targets.filter(t => t !== current_target);
}

let tokenOrder = [];
for (let i = 0; i < targets.length; i++) {
    let potential_targets = targets.filter(item => tokenOrder.indexOf(item) === -1);
    let from = current_target;
    let closest = potential_targets.reduce((a, b) => findClosestTo(from, a, b));
    tokenOrder.push(closest);
}

let origin = current_target;

let sequence = new Sequence(); // Create a new sequence
let prev = tokenOrder[0];
for (let target of tokenOrder) {
    /*let angle = Math.atan2(prev.y - origin.y, prev.x - origin.x) * 180 / Math.PI;
    if (target != prev) {
        console.debug("Angle", angle);
        sequence.effect()
            .file("modules/animated-spell-effects/spell-effects/scifi/bullet_barrage_01.webm")
            .atLocation(origin) // Going from origin
            .stretchTo(target) // To the current loop's target
            .randomOffset(0.5)
            .rotateIn(angle, 1000, {ease: "easeInOutSine"})
            .waitUntilFinished(-200) // Slight delay between each arc
    }*/
    sequence.effect()
            .file("modules/animated-spell-effects/spell-effects/scifi/bullet_barrage_01.webm")
            .atLocation(origin) // Going from origin
            .stretchTo(target) // To the current loop's target
            .randomOffset(0.5)
            .waitUntilFinished(-200) // Slight delay between each arc
    prev = target;

}
sequence.play()

function findClosestTo(from, a, b) {
    let a_dist = Math.atan2(a.y - from.y, a.x - from.x);
    while (a_dist >= Math.PI * 2) a_dist -= Math.PI * 2;
    while (a_dist < 0) a_dist += Math.PI * 2;
    let b_dist = Math.atan2(b.y - from.y, b.x - from.x);
    while (b_dist >= Math.PI * 2) b_dist -= Math.PI * 2;
    while (b_dist < 0) b_dist += Math.PI * 2;
    //console.debug("Comparing", a_dist, b_dist);
    return a_dist < b_dist ? a : b;
}