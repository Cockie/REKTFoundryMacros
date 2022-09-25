let selected = canvas.tokens.controlled[0];
let tactor = GetSheetActor(event);
if (!selected || selected.actor != tactor) {
    let tokens = canvas.tokens.placeables;
    if (tokens.length > 0) {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].actor == tactor) {
                selected = tokens[i];
                break;
            }
        }
    }
}
if (!selected) {
    ui.notifications.warn("No token found for this character");
    return;
}
let ammo = GetUsesOfcItemForToken(selected, "Blast Grenade");
if (ammo < 1) {
    ui.notifications.warn("No enough ammo for Blast Grenade");
    return;
}




let config = {
    size: 7,
    icon: 'modules/dinos-fancies/assets/icons/grenade.png',
    label: 'Blast Grenade',
    tag: 'chop power',
    drawIcon: true,
    drawOutline: true,
    interval: -1,
    rememberControlled: true
}

// pick position
let position = await warpgate.crosshairs.show(config);

ActivatecItemForToken(selected, "Blast Grenade");

//play animation
let rot = Math.floor(Math.random() * 360);
let sequence = new Sequence()

    .effect()
    .file("jb2a.throwable.throw.grenade.01.green")
    .atLocation(selected)
    .stretchTo(position)
    .effect()
    .file("jb2a.thunderwave.center.orange")
    .atLocation(position)
    .scale(1.5)
    .delay(2700)
    .waitUntilFinished(-1000)
    .effect()
    .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
    .atLocation(position)
    .rotate(rot)
    .belowTokens()
    .scale(1.5)
    .fadeIn(300, { ease: "easeInSine" })
    .name("Grenade_Blast")
    .persist()
    .effect()
    .file("modules/dinos-fancies/assets/BlastMarkDebrisLarge*.webp")
    .atLocation(position)
    .rotate(rot)
    .belowTokens()
    .scale(1.5)
    .fadeIn(300, { ease: "easeInSine" })
    .name("Grenade_Blast")
    .persist()
    .play();

await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [position]);

async function ActivatecItemForToken(token, scItemName) {
    // check if token has citem   
    let actor = token.actor;
    let citem = actor.data.data.citems.find(y => y.name == scItemName);
    if (citem != null) {
        let gitem = game.items.find(y => y.name == scItemName);
        if (gitem != null) {
            let cItemData = {};
            cItemData.id = citem.id;
            cItemData.value = citem.isactive;
            // check if consumable
            if (citem.usetype == "CON") {
                cItemData.iscon = true;
            }
            // check if it has a ciRoll
            // get the roll  		  
            let attrID = ''; // only used when not  ciroll in onRollCheck, set this to empty
            let ciRoll = true;
            let isFree = false; //  roll from free tables, 
            let tableKey = null; // used by free tables, not needed now  
            // go!       
            actor._sheet._onRollCheck(attrID, null, cItemData.id, null, ciRoll, isFree, tableKey, cItemData);
        }
    } else {
        // 
        ui.notifications.warn('The token(' + token.data.name + ') does not have the cItem ' + scItemName);
    }
}

function GetSheetActor(event) {
    let returnactor;
    let actorid = '';
    let cp = event.composedPath();
    for (let key in cp) {
        if (cp.hasOwnProperty(key)) {
            if ((typeof (cp[key]) !== "undefined" && cp[key] !== null)) {
                if ((typeof (cp[key].classList) !== "undefined" && cp[key].classList !== null)) {
                    if (cp[key].classList.contains('sandbox') && cp[key].classList.contains('sheet') && cp[key].classList.contains('actor')) {
                        //console.log(cp[key].id);  //actor-MMwTr94GekOCihrC   or actor-MMwTr94GekOCihrC-6bX8wMQkdZ9OyOQa
                        // get the id from the div
                        actorid = cp[key].id.substring(6);  // length of 'actor-'            
                        // if the actorid is double(ie MwTr94GekOCihrC-6bX8wMQkdZ9OyOQa), then it is a unlinked token, 
                        // need to get the actor from the canvas so use the secondary id            
                        if (actorid.length > 16) {
                            // get secondary actor id
                            actorid = actorid.substring(17);
                            //console.log('Token Actor ' + actorid);
                            //token = canvas.tokens.get(actorid);
                            let token = canvas.tokens.placeables.find(y => y.id == actorid);
                            if (token != null) {
                                returnactor = token.actor;
                            }
                        } else {
                            //console.log('Actor ' + actorid);   // MwTr94GekOCihrC
                            returnactor = game.actors.get(actorid);
                        }
                        // exit for loop
                        break;
                    }
                }
            }
        }
    }
    return returnactor;
}

function GetUsesOfcItemForToken(token, scItemName) {
    // check if token has citem   
    let actor = token.actor;
    let citem = actor.data.data.citems.find(y => y.name.startsWith(scItemName));
    if (citem) {
        return citem.uses;
    } else {
        return 0;
    }
}