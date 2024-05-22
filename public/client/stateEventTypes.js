export class JoinEvent {
    constructor(time, player) {
        this.time = time;
        this.player = player;
    }
    activate(state) {
        state.players.add(this.player.copy());
    }
}
