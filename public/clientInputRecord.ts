import InputRecord from "./InputRecord.js";

let clientInputRecord = new InputRecord();
document.body.addEventListener("keydown", (e) => {
    if(!e.repeat){
        // Start recording inputs
    }
})

export {clientInputRecord}