import InputTypes from "./InputTypes.js"

export default class Input {
    time: number
    type: InputTypes
    constructor(time: number, type: InputTypes) {
        this.time = time
        this.type = type
    }
}