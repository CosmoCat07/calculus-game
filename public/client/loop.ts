import {currentState} from "./currentState.js"
import {canvas, ctx} from "./canvas.js"
import {STEP_LENGTH} from "../game/constants.js"
import {stateHistory} from "./stateHistory.js"
import {drawState} from "./draw.js";
import InputType from "../game/InputType.js";
import {clientStateEvents} from "./clientStateEvents.js";
import {getTime} from "./time.js";

export default function loop(){
    while(currentState.time + STEP_LENGTH < getTime()) {
        for(let event of clientStateEvents) {
            if (currentState.time <= event.time && event.time < currentState.time + STEP_LENGTH) {
                event.activate(currentState)
            }
        }
        currentState.step()
        stateHistory.set(currentState.time, currentState.duplicate())
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawState(currentState)

    requestAnimationFrame(loop)
}