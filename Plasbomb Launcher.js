//THIS MACRO NEEDS THE WARPGATE MODULE

//TO USE THIS MACRO, you'll need Wasp's "Sequencer" module and Honeybadger's Wargate module
//You can find its documentation of Sequencer here on Github : https://github.com/fantasycalendar/FoundryVTT-Sequencer
//There is also a wiki with a lot more info if you want to dive into it : https://github.com/fantasycalendar/FoundryVTT-Sequencer/wiki

//You can use the "Show Sequencer Database" Tool in the toolbar of Foundry to preview all our Fireball explosion animation.
//Thanks to the module Sequencer, you'll also be able to copy the path of the asset you want in a single click and replace it here to customize the macro.

//It will play the animation of exploding fireball leaving cracks on the ground and choose the right file corresponding to the distance between the caster and the selected position. 
//Don't forget to select the caster before using this macro.


let config = {
    size:3,
    icon: 'modules/jb2a_patreon/Library/3rd_Level/Fireball/FireballExplosion_01_Orange_Thumb.webp',
    label: 'Plasbomb',
    tag: 'chop power',
    drawIcon: true,
    drawOutline: true,
    interval: -1,
    rememberControlled: true 
}


const selected = canvas.tokens.controlled[0];
let position = [await warpgate.crosshairs.show(config),await warpgate.crosshairs.show(config),await warpgate.crosshairs.show(config)];
let rot = Math.floor(Math.random() * 360);
let sequence = new Sequence()

    .effect()
        .file("jb2a.fire_bolt.green")
        .atLocation(selected)
        .reachTowards(position[0])
        .playbackRate(0.5)
        .scale(2)
    .effect()
        .file("jb2a.fire_bolt.green")
        .atLocation(selected)
        .reachTowards(position[1])
        .scale(2)
        .playbackRate(0.5)
        .delay(200)
    .effect()
        .file("jb2a.fire_bolt.green")
        .atLocation(selected)
        .reachTowards(position[2])
        .scale(2)
        .playbackRate(0.5)
        .delay(400)
        
    .effect()
        .file("modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Green_400x400.webm")
        .atLocation(position[0])
        .scale(1.15)
        .delay(700)
    .effect()
        .file("modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Green_400x400.webm")
        .atLocation(position[1])
        .scale(1.15)
        .delay(900)
    .effect()
        .file("modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Green_400x400.webm")
        .atLocation(position[2])
        .scale(1.15)
        .delay(1100)        
        
        
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation([0])
		.rotate(rot)
        .belowTokens()
        .delay(700)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation([1])
		.rotate(rot)
        .belowTokens()
        .delay(900)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()        
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation([2])
		.rotate(rot)
        .belowTokens()
        .delay(1100)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()          
        
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation(position[0])
		.rotate(rot)
        .belowTokens()
        .delay(700)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation(position[1])
		.rotate(rot)
        .belowTokens()
        .delay(900)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()
    .effect()
        .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
        .atLocation(position[2])
		.rotate(rot)
        .belowTokens()
        .delay(1100)
        .scale(.75)
        .fadeIn(300, {ease: "easeInSine"})
        .name("Grenade_Blast")
        .persist()        
.play();