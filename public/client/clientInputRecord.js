import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import inputTypes from "../game/inputTypes.js";
import { DASH_COOLDOWN, DASH_KEYS, FORWARD_KEYS, LEFT_KEYS, RIGHT_KEYS, SHOOT_KEYS } from "../game/constants.js";
let keys = new Set();
let dir = 0;
let lastDash = new Date().getTime();
let dashing = false;
let clientInputRecord;
function setupClientInputRecord(id) {
    clientInputRecord = new InputRecord(id);
}
function sharesElements(a, b) {
    for (let elem of a) {
        if (b.has(elem)) {
            return true;
        }
    }
    return false;
}
function keydown(e) {
    let now = new Date().getTime();
    if (!keys.has(e.code)) {
        if (FORWARD_KEYS.has(e.code)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.FORWARD));
        }
        if (LEFT_KEYS.has(e.code)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.LEFT));
            dir = -1;
        }
        if (RIGHT_KEYS.has(e.code)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.RIGHT));
            dir = 1;
        }
        if (DASH_KEYS.has(e.code) && now >= lastDash + DASH_COOLDOWN) {
            // Maybe implement dash buffer?
            // now + Math.max(0, now - lastDash - DASH_COOLDOWN)
            clientInputRecord.actions.push(new Input(now, inputTypes.DASH));
            lastDash = now;
            dashing = true;
        }
        if (SHOOT_KEYS.has(e.code)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.SHOOT));
        }
    }
    keys.add(e.code);
}
function keyup(e) {
    let now = new Date().getTime();
    if (FORWARD_KEYS.has(e.code)) {
        clientInputRecord.actions.push(new Input(now, inputTypes.STOP));
    }
    if (LEFT_KEYS.has(e.code) && dir == -1) {
        if (sharesElements(keys, RIGHT_KEYS)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.RIGHT));
        }
        else {
            clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
        }
    }
    if (RIGHT_KEYS.has(e.code) && dir == 1) {
        if (sharesElements(keys, LEFT_KEYS)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.LEFT));
        }
        else {
            clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
        }
    }
    if (DASH_KEYS.has(e.code) && dashing) {
        clientInputRecord.actions.push(new Input(now, inputTypes.END_DASH));
    }
    keys.delete(e.code);
}
function blur() {
    let now = new Date().getTime();
    if (sharesElements(keys, LEFT_KEYS) || sharesElements(keys, RIGHT_KEYS)) {
        clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
    }
    if (sharesElements(keys, FORWARD_KEYS)) {
        clientInputRecord.actions.push(new Input(now, inputTypes.STOP));
    }
    if (dashing) {
        clientInputRecord.actions.push(new Input(now, inputTypes.END_DASH));
    }
    keys.clear();
}
function startListening() {
    addEventListener("keydown", keydown);
    addEventListener("keyup", keyup);
    addEventListener("blur", blur);
}
export { clientInputRecord, startListening, setupClientInputRecord };
