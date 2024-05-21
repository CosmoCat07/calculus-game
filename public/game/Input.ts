import InputTypes from "./InputTypes.js"

export default class Input {
    time: number
    type: InputTypes
    constructor(time: number, type: InputTypes) {
        this.time = time
        this.type = type
    }

    serialize(): SerializedInput{
        return {
            time: this.time,
            type: this.type,
        }
    }
}

export type SerializedInput = {
    time: number
    type: InputTypes
}