export default class Input {
    constructor(time, type) {
        this.time = time;
        this.type = type;
    }
    serialize() {
        return {
            time: this.time,
            type: this.type,
        };
    }
}
