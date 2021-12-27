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

// check if token has citem   
let citem = tactor.data.data.citems.find(y => y.name.startsWith("Shotgun"));
if (citem != null) {
    let gitem = game.items.find(y => y.name == citem.name);
    if (gitem != null) {
        //set tmp damage
        await SetDamages(tactor, 2, 3, 4);
        //make the actual roll
        let fitem = await game.items.get(citem.id);
        let rollexp = fitem.data.data.roll;
        let rollname = fitem.data.data.rollname;
        let rollid = [fitem.data.data.rollid];
        let rollcitemID = citem.id;
        let actorattributes = tactor.data.data.attributes;
        let citemattributes = citem.attributes;
        let number = citem.number;
        let targets = game.user.targets.ids;
        let useData = {};
        useData.id = citem.id;
        useData.value = citem.isactive;
        if (citem.usetype == "CON") {
            useData.iscon = true;
        }
        await tactor._sheet.rollExpression(rollexp, rollname, rollid, actorattributes, citemattributes, number, rollcitemID, targets, null, useData);
        //deduct one more ammo and put back tmp damage
        await tactor.sheet.changeCIUses(citem.id, ammo - 2)
        await SetDamages(tactor, 0, 0, 0);
    }
} else {
    ui.notifications.warn('The token(' + token.data.name + ') does not have the cItem ' + scItemName);
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