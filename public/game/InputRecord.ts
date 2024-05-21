import Input from "./Input.js"

export default class InputRecord {
    id: number
    inputs: Array<Input>
    constructor(id: number, inputs = new Array<Input>()) {
        this.id = id
        this.inputs = inputs
    }
}