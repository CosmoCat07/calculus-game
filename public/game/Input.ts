import inputTypes from "./inputTypes.js"

export default class Input {
    time: number
    type: inputTypes
    constructor(time: number, type: inputTypes) {
        this.time = time
        this.type = type
    }
}