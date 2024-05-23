import {currentState} from "./currentState.js"
import {canvas, ctx} from "./canvas.js"
import {STEP_LENGTH} from "../game/constants.js"
import {stateHistory} from "./stateHistory.js"
import {drawState} from "./draw.js";
import InputType from "../game/InputType.js";
import {clientStateEvents} from "./clientStateEvents.js";
import {getTime} from "./time.js";
import Player from "../game/Player.js";
import {clientInputRecord} from "./clientInputRecord.js";
import Camera from "./Camera.js";

let camera = new Camera()
let furthestTime = 0

export default function loop(){
    let clientPlayer
    for(let player of currentState.players){
        if(player.inputRecord == clientInputRecord){
            clientPlayer = player
        }
    }
    while(currentState.time + STEP_LENGTH < getTime()) {
        for(let event of clientStateEvents) {
            if (currentState.time <= event.time && event.time < currentState.time + STEP_LENGTH) {
                event.activate(currentState)
            }
        }
        currentState.step()
        stateHistory.set(currentState.time, currentState.duplicate())
        if(currentState.time > furthestTime){
            camera.step(clientPlayer as Player)
            furthestTime = currentState.time
        }
    }

    drawState(currentState, camera)

    requestAnimationFrame(loop)
}