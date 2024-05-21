import {currentState} from "./currentState.js"
import {canvas, ctx} from "./canvas.js"
import {STEP_LENGTH} from "../game/constants.js"
import {stateHistory} from "./stateHistory.js"
import {drawState} from "./draw.js";

export default function loop(){
    while(currentState.time + STEP_LENGTH < new Date().getTime()) {
        currentState.step()
        stateHistory.set(currentState.time, currentState.duplicate())
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawState(currentState)

    requestAnimationFrame(loop)
}