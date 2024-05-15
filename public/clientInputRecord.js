import InputRecord from "./InputRecord.js";
let clientInputRecord = new InputRecord();
console.log("asdf");
document.body.addEventListener("keydown", (e) => {
    if (!e.repeat) {
        if (e.code == "ArrowUp") {
            clientInputRecord.actions.push();
        }
    }
});
export { clientInputRecord };
