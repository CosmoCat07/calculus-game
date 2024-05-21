export function serializeInput(input) {
    return {
        time: input.time,
        type: input.type,
    };
}
export function serializeInputRecord(inputRecord) {
    let serializedInputs = [];
    for (let input of inputRecord.inputs) {
        serializedInputs.push(serializeInput(input));
    }
    return {
        id: inputRecord.id,
        inputs: serializedInputs,
    };
}
function serializePlayer(player) {
    return {
        x: player.x, y: player.y,
        xVel: player.xVel, yVel: player.yVel,
        rot: player.rot, rotVel: player.rotVel,
        shootProgress: player.shootProgress,
        turn: player.turn, move: player.move, slide: player.slide,
        inputId: player.inputs.id
    };
}
function serializeBullet(bullet) {
    return {
        startX: bullet.startX,
        startY: bullet.startY,
        xVel: bullet.xVel,
        yVel: bullet.yVel,
        startTime: bullet.startTime,
    };
}
function serializeState(state) {
    let serializedPlayers = [];
    for (let player of state.players) {
        serializedPlayers.push(serializePlayer(player));
    }
    let serializedBullets = [];
    for (let bullet of state.bullets) {
        serializedBullets.push(serializeBullet(bullet));
    }
    return {
        time: state.time,
        players: serializedPlayers,
        bullets: serializedBullets
    };
}
