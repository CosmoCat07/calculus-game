export default class InputRecord {
    constructor(id) {
        this.inputs = new Array();
        this.id = id;
    }
    serialize() {
        let serializedInputs = [];
        for (let input of this.inputs) {
            serializedInputs.push(input.serialize());
        }
        return {
            id: this.id,
            inputs: serializedInputs,
        };
    }
}
