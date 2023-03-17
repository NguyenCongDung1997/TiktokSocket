export const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const getFileName = (path) => {
    return path.split("/").pop();
}

export const isBetween = (start, end) => {
    if(!start || !end) return true;
    const now = new Date();
    const nowH = now.getHours();
    const nowM = now.getMinutes();
    const [startH, startM] = start.split(":").map(x => +x);
    const [endH, endM] = end.split(":").map(x => +x);

    if (startH > nowH || endH < nowH) return false;

    if (startH == nowH && startM > nowM) {
        return false;
    }
    if (endH == nowH && endM < nowM) {
        return false;
    }

    return true;
}