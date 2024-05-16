import { currentState } from "./currentState.js";
import { canvas, ctx } from "./canvas.js";
import { STEP_LENGTH } from "../game/constants.js";
export default function gameLoop() {
    // console.log(clientInputRecord.actions)
    while (currentState.time + STEP_LENGTH < new Date().getTime()) {
        // console.log(currentState.time)
        currentState.step();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentState.draw();
    requestAnimationFrame(gameLoop);
}
