import InputRecord from "../game/InputRecord.js";
import Input from "../game/Input.js";
import inputTypes from "../game/inputTypes.js";
import { DASH_COOLDOWN, DASH_KEY, FORWARD_KEY, LEFT_KEY, RIGHT_KEY, SHOOT_KEY } from "../game/constants.js";
let keys = new Set();
let dir = 0;
let lastDash = new Date().getTime();
let dashing = false;
let clientInputRecord = new InputRecord();
function keydown(e) {
    let now = new Date().getTime();
    if (!keys.has(e.code)) {
        if (e.code == FORWARD_KEY) {
            clientInputRecord.actions.push(new Input(now, inputTypes.FORWARD));
        }
        if (e.code == LEFT_KEY) {
            clientInputRecord.actions.push(new Input(now, inputTypes.LEFT));
            dir = -1;
        }
        if (e.code == RIGHT_KEY) {
            clientInputRecord.actions.push(new Input(now, inputTypes.RIGHT));
            dir = 1;
        }
        if (e.code == DASH_KEY && now >= lastDash + DASH_COOLDOWN) {
            // Maybe implement dash buffer?
            // now + Math.max(0, now - lastDash - DASH_COOLDOWN)
            clientInputRecord.actions.push(new Input(now, inputTypes.DASH));
            lastDash = now;
            dashing = true;
        }
        if (e.code == SHOOT_KEY) {
            clientInputRecord.actions.push(new Input(now, inputTypes.SHOOT));
        }
    }
    keys.add(e.code);
}
function keyup(e) {
    let now = new Date().getTime();
    if (e.code == FORWARD_KEY) {
        clientInputRecord.actions.push(new Input(now, inputTypes.STOP));
    }
    if (e.code == LEFT_KEY && dir == -1) {
        if (keys.has(RIGHT_KEY)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.RIGHT));
        }
        else {
            clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
        }
    }
    if (e.code == RIGHT_KEY && dir == 1) {
        if (keys.has(LEFT_KEY)) {
            clientInputRecord.actions.push(new Input(now, inputTypes.LEFT));
        }
        else {
            clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
        }
    }
    if (e.code == DASH_KEY && dashing) {
        clientInputRecord.actions.push(new Input(now, inputTypes.END_DASH));
    }
    keys.delete(e.code);
}
function blur() {
    let now = new Date().getTime();
    if (keys.has(LEFT_KEY) || keys.has(RIGHT_KEY)) {
        clientInputRecord.actions.push(new Input(now, inputTypes.STRAIGHT));
    }
    if (keys.has(FORWARD_KEY)) {
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
export { clientInputRecord, startListening };
