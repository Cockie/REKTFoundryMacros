let d = new Dialog({
    title: "Thermal Lash",
    content: "<p>Pick an option</p>",
    buttons: {
        slice: {
            label: "Slice",
            callback: () => Slice()
        },
        sear: {
            label: "Sear",
            callback: () => Sear()
        },
        pull: {
            label: "Pull",
            callback: () => Pull()
        },
        trip: {
            label: "Trip",
            callback: () => Trip()
        },
        disarm: {
            label: "Disarm",
            callback: () => Disarm()
        }
    },
    default: "two",
    render: html => console.log("Register interactivity in the rendered dialog"),
    close: html => console.log("This always is logged no matter which option is chosen")
});
d.render(true);

function Slice() {
    let roll = new Roll(`1d3+2`).roll();
    let results_html = `<h2>Slice</h2>
    The attacker releases their hold with a rapid tug, slicing the enemy with the filament for 2 points of damage (if it gets past an armor roll: ${roll.total}).`

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content: results_html
    });
}

function Sear() {
    let roll = new Roll(`1d3+2`).roll();
    let results_html = `<h2>Sear</h2>
    If it gets past an armor roll (${roll.total}), the enemy takes 1 point of damage (on that bodypart, if applicable). The lash holds firm.`

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content: results_html
    });
}

function Pull() {
    let results_html = `<h2>Pull</h2>
    If the enemy is of near-equal size or smaller, the enemy is pulled nearer or adjacent to the attacker in a straight line. Alternatively, if the enemy is near-equal or greater in size, the attacker may choose to pull themselves nearer or adjacent in a straight line. The lash holds firm.`

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content: results_html
    });
}

function Trip() {
    let results_html = `<h2>Trip</h2>
    The enemy falls prone. The lash holds firm.`

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content: results_html
    });
}

function Disarm() {
    let results_html = `<h2>Disarm</h2>
    (Only available on the action where the enemy is first grabbed) The attacker states which weapon they're trying to disarm. The enemy then rolls an Athletics save, the difficulty of which is determined by the size of the weapon in question (inf requires > 12, heavy inf requires > 10, and ship weapons require > 8. If they fail, they drop the weapon held in that hand and it slides one tile towards the attacker, requiring someone to stop on that tile to pick it up. Regardless of the roll, the lash is released.
        `

    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content: results_html
    });
}