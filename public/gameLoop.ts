import {currentState} from "./currentState.js";

export default function gameLoop(){
    while(currentState.time < new Date().getTime()) {
        currentState.step()
    }

    currentState.draw()

    requestAnimationFrame(gameLoop);
}