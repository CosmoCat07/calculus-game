import State from "../game/State.js"

declare global {
    interface Window { currentState: State }
}

let currentState: State

function setCurrentState(newState: State){
    currentState = newState
    window.currentState = currentState
}

export {currentState, setCurrentState}