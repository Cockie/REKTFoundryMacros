let tokenD = canvas.tokens.controlled[0];
let tactor = GetSheetActor(event);
if (!tokenD || tokenD.actor != tactor) {
    let tokens = canvas.tokens.placeables;
    if (tokens.length > 0) {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].actor == tactor) {
                tokenD = tokens[i];
                break;
            }
        }
    }
}
if (!tokenD) {
    ui.notifications.warn("No token found for this character");
    return;
}
let ammo = GetUsesOfcItemForToken(tokenD, "Shotgun");
if (ammo < 2) {
    ui.notifications.warn("No enough ammo for Shotgun");
    return;
}

await SetDamages(tactor, 2, 3, 4);
//make the actual roll
await ActivatecItemForToken(tokenD, "Shotgun");  
await ReduceUsesOfcItemForToken(tokenD, "Shotgun", 1);
await SetDamages(tactor, 0, 0, 0);

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

async function ReduceUsesOfcItemForToken(token, scItemName, amount) {
    let actor = token.actor;
    let citem = actor.data.data.citems.find(y => y.name == scItemName);
    //console.debug("Item", citem);
    if (actor !== null && citem !== null) {
        // check if consumable        
        if (citem.usetype == "CON") {
            if (citem.uses > 0) {
                await actor.sheet.changeCIUses(citem.id, parseInt(citem.uses) - amount);
            } else {
                ui.notifications.warn('ActorcItem_DecreaseUses | cItem with name [' + citem.name + '] charges can not be decreased below [0]');
            }
        } else {
            ui.notifications.warn('ActorcItem_DecreaseUses | cItem with name [' + citem.name + '] is not CONSUMABLE');
        }
    } else {
        ui.notifications.warn('ActorcItem_DecreaseUses | Invalid parameters');
    }
}

async function SetDamages(actor, graze, normal, epic) {
    if (actor !== null) {
        await actor.update({
            [`data.attributes.NUM_TMPDAMAGEGRAZE.value`]: graze,
            [`data.attributes.NUM_TMPDAMAGEGRAZE.modified`]: true,
            [`data.attributes.NUM_TMPDAMAGENORMAL.value`]: normal,
            [`data.attributes.NUM_TMPDAMAGENORMAL.modified`]: true,
            [`data.attributes.NUM_TMPDAMAGEEPIC.value`]: epic,
            [`data.attributes.NUM_TMPDAMAGEEPIC.modified`]: true,
        });
    }
}