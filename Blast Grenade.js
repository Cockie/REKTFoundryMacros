//THIS MACRO NEED THE WARPGATE MODULE AND IS INTENDED FOR FIREBALL ONLY.
//

//TO USE THIS MACRO, you'll need Wasp's "Sequencer" module and Honeybadger's Wargate module
//You can find its documentation of Sequencer here on Github : https://github.com/fantasycalendar/FoundryVTT-Sequencer
//There is also a wiki with a lot more info if you want to dive into it : https://github.com/fantasycalendar/FoundryVTT-Sequencer/wiki

//You can use the "Show Sequencer Database" Tool in the toolbar of Foundry to preview all our Fireball explosion animation.
//Thanks to the module Sequencer, you'll also be able to copy the path of the asset you want in a single click and replace it here to customize the macro.

//It will play the animation of exploding fireball leaving cracks on the ground and choose the right file corresponding to the distance between the caster and the selected position. 
//Don't forget to select the caster before using this macro.


let config = {
    size:6,
    icon: 'modules/jb2a_patreon/Library/3rd_Level/Fireball/FireballExplosion_01_Orange_Thumb.webp',
    label: 'Fireball',
    tag: 'chop power',
    drawIcon: true,
    drawOutline: true,
    interval: 1,
    rememberControlled: true 
}


const selected = canvas.tokens.controlled[0];
let position = await warpgate.crosshairs.show(config);
let rot = Math.floor(Math.random() * 360);
let sequence = new Sequence()

    .effect()
        .file("jb2a.slingshot")
        .atLocation(selected)
        .reachTowards(position)
    .effect()
        .file("jb2a.fireball.explosion.orange")
        .atLocation(position)
        .scale(1.15)
        .delay(3000)
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation(position)
		.rotate(rot)
        .belowTokens()
        .delay(3200)
        .scale(1.5)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation(position)
		.rotate(rot)
        .belowTokens()
        .delay(3200)
        .scale(1.5)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()
.play();