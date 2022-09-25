//THIS MACRO NEEDS THE WARPGATE MODULE

//TO USE THIS MACRO, you'll need Wasp's "Sequencer" module and Honeybadger's Wargate module
//You can find its documentation of Sequencer here on Github : https://github.com/fantasycalendar/FoundryVTT-Sequencer
//There is also a wiki with a lot more info if you want to dive into it : https://github.com/fantasycalendar/FoundryVTT-Sequencer/wiki

//You can use the "Show Sequencer Database" Tool in the toolbar of Foundry to preview all our Fireball explosion animation.
//Thanks to the module Sequencer, you'll also be able to copy the path of the asset you want in a single click and replace it here to customize the macro.

//It will play the animation of exploding fireball leaving cracks on the ground and choose the right file corresponding to the distance between the caster and the selected position. 
//Don't forget to select the caster before using this macro.


let config = {
    size:7,
    icon: 'modules/jb2a_patreon/Library/3rd_Level/Fireball/FireballExplosion_01_Orange_Thumb.webp',
    label: 'Zap zap',
    tag: 'chop power',
    drawIcon: true,
    drawOutline: true,
    interval: -1,
    rememberControlled: true 
}


const selected = canvas.tokens.controlled[0];
let position = [0,0,0];
for (let i = 0; i < 3; i++){
    position[i] = await warpgate.crosshairs.show(config);
    //MeasuredTemplate.create(position[i]);
}
let rot = Math.floor(Math.random() * 360);
let sequence = new Sequence()

    .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .atLocation(selected)
		.delay(100)
        .stretchTo(position[0])
    .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .atLocation(selected)
        .stretchTo(position[1])
    .effect()
        .file("jb2a.chain_lightning.primary.blue")
        .atLocation(selected)
		.delay(200)
        .stretchTo(position[2])       
    .effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/electricity/electric_dishcarge_CIRCLE_09.webm")
        .atLocation(position[0])
        .scale(1.15)
        .delay(600)
		.persist() 
    .effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/electricity/electric_dishcarge_CIRCLE_09.webm")
        .atLocation(position[1])
        .scale(1.15)
        .delay(500)
		.persist() 
    .effect()
        .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/electricity/electric_dishcarge_CIRCLE_09.webm")
        .atLocation(position[2])
        .scale(1.15)
        .delay(700)
        .persist()         
        
               
.play();