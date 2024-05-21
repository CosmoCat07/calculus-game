import Input, {SerializedInput} from "./Input.js"

export default class InputRecord {
    id: number
    inputs = new Array<Input>()
    constructor(id: number) {
        this.id = id
    }

    serialize(): SerializedInputRecord {
        let serializedInputs = []
        for(let input of this.inputs){
            serializedInputs.push(input.serialize())
        }
        return {
            id: this.id,
            inputs: serializedInputs,
        }
    }
}

export type SerializedInputRecord = {
    id: number,
    inputs: Array<SerializedInput>,
}