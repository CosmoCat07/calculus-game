import Input from "../game/Input.js";
import InputType from "../game/InputType.js";
import { DASH_COOLDOWN, DASH_KEYS, FORWARD_KEYS, LEFT_KEYS, RIGHT_KEYS, SHOOT_KEYS } from "../game/constants.js";
let keys = new Set();
let dir = 0;
let lastDash = new Date().getTime();
let dashing = false;
let clientInputRecord;
function setClientInputRecord(newClientInputRecord) {
    clientInputRecord = newClientInputRecord;
    window.exposed.clientInputRecord = clientInputRecord;
}
function sharesElements(a, b) {
    for (let elem of a) {
        if (b.has(elem)) {
            return true;
        }
    }
    return false;
}
function registerInput(inputType) {
}
function keydown(e) {
    let now = new Date().getTime();
    if (!keys.has(e.code)) {
        if (FORWARD_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputType.FORWARD));
        }
        if (LEFT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputType.LEFT));
            dir = -1;
        }
        if (RIGHT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputType.RIGHT));
            dir = 1;
        }
        if (DASH_KEYS.has(e.code) && now >= lastDash + DASH_COOLDOWN) {
            // Maybe implement dash buffer?
            // now + Math.max(0, now - lastDash - DASH_COOLDOWN)
            clientInputRecord.inputs.push(new Input(now, InputType.DASH));
            lastDash = now;
            dashing = true;
        }
        if (SHOOT_KEYS.has(e.code)) {
            clientInputRecord.inputs.push(new Input(now, InputType.SHOOT));
        }
    }
    keys.add(e.code);
}
function keyup(e) {
    let now = new Date().getTime();
    if (FORWARD_KEYS.has(e.code)) {
        clientInputRecord.inputs.push(new Input(now, InputType.STOP));
    }
    if (LEFT_KEYS.has(e.code) && dir == -1) {
        if (sharesElements(keys, RIGHT_KEYS)) {
            clientInputRecord.inputs.push(new Input(now, InputType.RIGHT));
        }
        else {
            clientInputRecord.inputs.push(new Input(now, InputType.STRAIGHT));
        }
    }
    if (RIGHT_KEYS.has(e.code) && dir == 1) {
        if (sharesElements(keys, LEFT_KEYS)) {
            clientInputRecord.inputs.push(new Input(now, InputType.LEFT));
        }
        else {
            clientInputRecord.inputs.push(new Input(now, InputType.STRAIGHT));
        }
    }
    if (DASH_KEYS.has(e.code) && dashing) {
        clientInputRecord.inputs.push(new Input(now, InputType.END_DASH));
    }
    keys.delete(e.code);
}
function blur() {
    let now = new Date().getTime();
    if (sharesElements(keys, LEFT_KEYS) || sharesElements(keys, RIGHT_KEYS)) {
        clientInputRecord.inputs.push(new Input(now, InputType.STRAIGHT));
    }
    if (sharesElements(keys, FORWARD_KEYS)) {
        clientInputRecord.inputs.push(new Input(now, InputType.STOP));
    }
    if (dashing) {
        clientInputRecord.inputs.push(new Input(now, InputType.END_DASH));
    }
    keys.clear();
}
function startListening() {
    addEventListener("keydown", keydown);
    addEventListener("keyup", keyup);
    addEventListener("blur", blur);
}
export { clientInputRecord, startListening, setClientInputRecord };
