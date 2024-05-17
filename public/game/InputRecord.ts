import Input from "./Input.js"

export default class InputRecord {
    actions = new Array<Input>()
    id: number
    constructor(id: number) {
        this.id = id
    }
}