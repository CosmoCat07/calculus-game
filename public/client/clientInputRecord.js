import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import InputTypes from "../game/InputTypes.js";
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
            clientInputRecord.inputs.push(new Input(now, InputTypes.FORWARD));
        }
        if (LEFT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputTypes.LEFT));
            dir = -1;
        }
        if (RIGHT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputTypes.RIGHT));
            dir = 1;
        }
        if (DASH_KEYS.has(e.code) && now >= lastDash + DASH_COOLDOWN) {
            // Maybe implement dash buffer?
            // now + Math.max(0, now - lastDash - DASH_COOLDOWN)
            clientInputRecord.inputs.push(new Input(now, InputTypes.DASH));
            lastDash = now;
            dashing = true;
        }
        if (SHOOT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputTypes.SHOOT));
        }
    }
    keys.add(e.code);
}
function keyup(e) {
    let now = new Date().getTime();
    if (FORWARD_KEYS.has(e.code)) {
        clientInputRecord.inputs.push(new Input(now, InputTypes.STOP));
    }
    if (LEFT_KEYS.has(e.code) && dir == -1) {
        if (sharesElements(keys, RIGHT_KEYS)) {
            clientInputRecord.inputs.push(new Input(now, InputTypes.RIGHT));
        }
        else {
            clientInputRecord.inputs.push(new Input(now, InputTypes.STRAIGHT));
        }
    }
    if (RIGHT_KEYS.has(e.code) && dir == 1) {
        if (sharesElements(keys, LEFT_KEYS)) {
            clientInputRecord.inputs.push(new Input(now, InputTypes.LEFT));
        }
        else {
            clientInputRecord.inputs.push(new Input(now, InputTypes.STRAIGHT));
        }
    }
    if (DASH_KEYS.has(e.code) && dashing) {
        clientInputRecord.inputs.push(new Input(now, InputTypes.END_DASH));
    }
    keys.delete(e.code);
}
function blur() {
    let now = new Date().getTime();
    if (sharesElements(keys, LEFT_KEYS) || sharesElements(keys, RIGHT_KEYS)) {
        clientInputRecord.inputs.push(new Input(now, InputTypes.STRAIGHT));
    }
    if (sharesElements(keys, FORWARD_KEYS)) {
        clientInputRecord.inputs.push(new Input(now, InputTypes.STOP));
    }
    if (dashing) {
        clientInputRecord.inputs.push(new Input(now, InputTypes.END_DASH));
    }
    keys.clear();
}
function startListening() {
    addEventListener("keydown", keydown);
    addEventListener("keyup", keyup);
    addEventListener("blur", blur);
}
export { clientInputRecord, startListening, setupClientInputRecord };
