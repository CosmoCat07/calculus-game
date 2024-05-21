import { setupClientInputRecord } from "./clientInputRecord.js";
let ws;
function openSocket() {
    ws = new WebSocket("ws://localhost:3000/socket");
    ws.addEventListener('open', () => {
        ws.send("test");
    });
    window.ws = ws;
    ws.onmessage = (event) => {
        // Set the state to be the initial state
        let eventData = JSON.parse(event.data);
        if (eventData.type === "init") {
            let data = eventData.data;
            console.log("asdoijfjaoiedbcxiujawoidjxzociuvlhaiuwlhd");
            const id = 0;
            setupClientInputRecord(id);
            //loop()
        }
        else if (eventData.type === "newstate") {
            // const time = 0
            // const players = new Array<Player>()
            // const bullets = new Array<Bullet>()
            // const state = new State(time, new Set(players), new Set(bullets)) // Actually set this up right
            // setCurrentState(state)
        }
        else {
            // const time = 0
            // const roundedTime = 0
            // const player = 0
            // const inputType = inputTypes.LEFT
            //
            // const input = new Input(time, inputType); // THIS SEMICOLON IS NECESSARY!!!
            // (enemyInputRecords.get(player) as InputRecord).actions.push(input)
            // if (roundedTime < currentState.time) {
            //     setCurrentState(stateHistory.get(roundedTime) as State) // Pray time didn't get rewinded too far
            // }
        }
        // Handle other events like player creation and deletion, or other stuff
    };
}
export { ws, openSocket };
