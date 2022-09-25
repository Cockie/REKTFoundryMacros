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
if (!CheckUsesOfcItemForToken(tokenD, "Rocket Boots")) {
  ui.notifications.warn("No remaining uses for Rocket Boots");
  return;
}
let mov = GetActorPropertyValue(tactor, 'NUM_MOVEMENT');
if (!mov) {
  mov = 4;
}
let range = await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [{
  t: "circle",
  user: game.user._id,
  x: tokenD.x + canvas.grid.size / 2,
  y: tokenD.y + canvas.grid.size / 2,
  direction: 0,
  distance: 2 * 5 * mov,
  borderColor: "#FF0000",
}]);

let config = {
  size: 1,
  icon: 'icons/skills/movement/feet-winged-boots-glowing-yellow.webp',
  drawIcon: true,
  label: 'Rocket Boots',
  tag: 'boots boots',
  drawOutline: true,
  rememberControlled: true
}

let position = await warpgate.crosshairs.show(config);
ActivatecItemForToken(tokenD, "Rocket Boots");
range[0].delete();
let sequence = new Sequence()
  .effect()
  .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/fire/fire_spiral_CIRCLE_01.webm")
  .atLocation(tokenD)
  .scale(0.35)
  .wait(1000)
  .effect()
  .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/fire/fire_blast_RAY_02.webm")
  .atLocation(tokenD)
  .stretchTo(position)
  .wait(100)
  .animation()
  .on(tokenD)
  .teleportTo(position)
  .snapToGrid()
  .waitUntilFinished()
  .effect()
  .file("modules/animated-spell-effects-cartoon/spell-effects/cartoon/mix/fire_earth_explosion_CIRCLE_01.webm")
  .atLocation(position)
  .scale(0.5)

sequence.play();


function GetActorPropertyValue(actor, propertykey) {
  let returnvalue;
  if (actor !== null && propertykey !== '') {
    if (actor.data.data.attributes.hasOwnProperty(propertykey)) {
      returnvalue = actor.data.data.attributes[propertykey].value;
    }
  }
  return returnvalue;
}

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

function CheckUsesOfcItemForToken(token, scItemName) {
  // check if token has citem   
  let actor = token.actor;
  let citem = actor.data.data.citems.find(y => y.name == scItemName);
  //console.debug("Item", citem);
  if (!citem || citem.uses <= 0) {
    return false;
  } else {
    return true;
  }
}