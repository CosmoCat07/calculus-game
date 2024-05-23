let offset = 0

function getTime(){
    return Date.now() + offset
    // return Date.now()
}

function setCurrentTime(newTime: number){
    offset = newTime - Date.now()
}

export {offset, getTime, setCurrentTime}