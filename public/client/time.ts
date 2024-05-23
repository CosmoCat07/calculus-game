let offset = 0

function getTime(){
    return Date.now() + offset
    // return Date.now()
}

function setOffset(newOffset: number){
    offset = newOffset
}

export {offset, getTime, setOffset}