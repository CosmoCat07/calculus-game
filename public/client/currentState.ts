import State from "../game/State.js"

let currentState: State

function setCurrentState(newState: State){
    currentState = newState
}

export {currentState, setCurrentState}