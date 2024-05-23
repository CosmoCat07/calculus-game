export class JoinEvent {
    constructor(time, player) {
        this.time = time;
        this.player = player;
    }
    activate(state) {
        state.players.add(this.player.copy());
    }
}
export class DisconnectEvent {
    constructor(time, id) {
        this.time = time;
        this.id = id;
    }
    activate(state) {
        state.players.forEach((player) => {
            if (player.inputRecord.id === this.id) {
                state.players.delete(player);
            }
        });
    }
}
