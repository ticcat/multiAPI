export function sleep(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

export function randomSleep(maxSeconds) {
    return sleep(Math.floor(Math.random() * maxSeconds) * 1000);
}
