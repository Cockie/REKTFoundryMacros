const selected = canvas.tokens.controlled[0];
if (!selected) {
    ui.notifications.warn("No token selected");
    return;
}
let config = {
    size: 5,
    icon: 'modules/jb2a_patreon/Library/3rd_Level/Fireball/FireballExplosion_01_Orange_Thumb.webp',
    label: 'Gravity Gun',
    tag: 'chop power',
    drawIcon: true,
    drawOutline: true,
    interval: -1,
    rememberControlled: true
}

let range = await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [{
    t: "circle",
    user: game.user._id,
    x: selected.x + canvas.grid.size / 2,
    y: selected.y + canvas.grid.size / 2,
    direction: 0,
    distance: 24 * 5,
    borderColor: "#FF0000",
  }]);



let position = await warpgate.crosshairs.show(config);
range[0].delete();

let rot = Math.floor(Math.random() * 360);
let sequence = new Sequence()

    .effect()
    .file("jb2a.markers.02.dark_bluewhite")
    .atLocation(selected)
    .waitUntilFinished(-300)
    .playbackRate(2)
    .effect()
    .file("jb2a.sphere_of_annihilation.600px.blue")
    .atLocation(selected)
    .scaleIn(0.1, 2000, { ease: "easeInSine" })
    .moveTowards(position, { ease: "easeInSine" })
    .waitUntilFinished(-50)
    .effect()
    .file("jb2a.impact.004.blue")
    .atLocation(position)
    .scale(2)
    .effect()
    .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
    .atLocation(position)
    .rotate(rot)
    .belowTokens()
    .delay(200)
    .fadeIn(300, { ease: "easeInSine" })
    .name("Grenade_Blast")
    .persist()
    .effect()
    .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
    .atLocation(position)
    .rotate(rot)
    .belowTokens()
    .delay(200)
    .fadeIn(300, { ease: "easeInSine" })
    .name("Grenade_Blast")
    .persist()
    .play();