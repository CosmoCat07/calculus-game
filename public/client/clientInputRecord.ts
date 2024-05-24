import InputRecord from "../game/InputRecord.js"
import Input from "../game/Input.js"
import InputType from "../game/InputType.js"
import {DASH_COOLDOWN, DASH_KEYS, FORWARD_KEYS, LEFT_KEYS, RIGHT_KEYS, SHOOT_KEYS} from "../game/constants.js"
import {ws} from "./ws.js";
import {deserializeInput} from "../serialization/deserialize.js";
import {getTime} from "./time.js";

let keys = new Set<string>()
let dir = 0

let lastDash = getTime()
let dashing = false

let clientInputRecord: InputRecord

function setClientInputRecord(newClientInputRecord: InputRecord) {
    clientInputRecord = newClientInputRecord
    window.exposed.clientInputRecord = clientInputRecord
}

function sharesElements<T>(a: Set<T>, b: Set<T>){
    for(let elem of a){
        if(b.has(elem)){
            return true
        }
    }
    return false
}

function recordInput(inputType: InputType){
    let input = new Input(getTime(), inputType)
    clientInputRecord.inputs.push(input)
    ws.send(JSON.stringify({
        type: "input",
        data: {
            input: deserializeInput(input)
        },
    }))
}

function keydown(e: KeyboardEvent){
    let now = getTime()
    if(!keys.has(e.code)){
        keys.add(e.code)
        if(FORWARD_KEYS.has(e.code)){
            recordInput(InputType.FORWARD)
        }
        if(LEFT_KEYS.has(e.code)){
            recordInput(InputType.LEFT)
            dir = -1
        }
        if(RIGHT_KEYS.has(e.code)){
            recordInput(InputType.RIGHT)
            dir = 1
        }
        if(DASH_KEYS.has(e.code) && now >= lastDash + DASH_COOLDOWN){
            // Maybe implement dash buffer?
            // now + Math.max(0, now - lastDash - DASH_COOLDOWN)
            recordInput(InputType.DASH)
            lastDash = now
            dashing = true
        }
        if(SHOOT_KEYS.has(e.code)){
            recordInput(InputType.SHOOT)
        }
        if(keys.has("Digit1") && keys.has("KeyP") && keys.has("KeyV")){
            ws.send(JSON.stringify({
                type: "modeChange",
                data: {},
            }))
        }
    }
}

function keyup(e: KeyboardEvent){
    if(FORWARD_KEYS.has(e.code)){
        recordInput(InputType.STOP)
    }
    if(LEFT_KEYS.has(e.code) && dir == -1){
        if(sharesElements(keys, RIGHT_KEYS)){
            recordInput(InputType.RIGHT)
        }else{
            recordInput(InputType.STRAIGHT)
        }
    }
    if(RIGHT_KEYS.has(e.code) && dir == 1){
        if(sharesElements(keys, LEFT_KEYS)){
            recordInput(InputType.LEFT)
        }else{
            recordInput(InputType.STRAIGHT)
        }
    }
    if(DASH_KEYS.has(e.code) && dashing){
        recordInput(InputType.END_DASH)
    }
    keys.delete(e.code)
}

function blur(){
    if(sharesElements(keys, LEFT_KEYS) || sharesElements(keys, RIGHT_KEYS)){
        recordInput(InputType.STRAIGHT)
    }
    if(sharesElements(keys, FORWARD_KEYS)){
        recordInput(InputType.STOP)
    }
    if(dashing){
        recordInput(InputType.END_DASH)
    }
    keys.clear()
}

function startListening(){
    addEventListener("keydown", keydown)
    addEventListener("keyup", keyup)
    addEventListener("blur", blur)
}

export {clientInputRecord, startListening, setClientInputRecord}