import InputType from "./InputType.js"

export default class Input {
    time: number
    type: InputType
    constructor(time: number, type: InputType) {
        this.time = time
        this.type = type
    }
}