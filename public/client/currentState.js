let currentState;
function setCurrentState(newState) {
    currentState = newState;
    window.currentState = currentState;
}
export { currentState, setCurrentState };
