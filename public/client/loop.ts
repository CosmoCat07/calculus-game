import {currentState} from "./currentState.js"
import {canvas, ctx} from "./canvas.js"
import {clientInputRecord} from "./clientInputRecord.js"
import {STEP_LENGTH} from "../game/constants.js"
import {stateHistory} from "./stateHistory.js"

export default function loop(){
    while(currentState.time + STEP_LENGTH < new Date().getTime()) {
        currentState.step()
        stateHistory.set(currentState.time, currentState.duplicate())
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    currentState.draw()

    requestAnimationFrame(loop)
}