export const typeSend = {
    SEND_MESSAGE: 1,
    GET_MESSAGES_BY_USER_INIT_V2: 2
}
export const option = {
    appKey: "b42d99769353ce6304e74fb597e36e90",
    fpId: 92,
    appId: 5341,
    stringKey: "f8a69f1719916z"
}
export const headers = {
    "authority": "seller-vn.tiktok.com",
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
}
export function long(num) {
    const number = BigInt(num);
    const hexString = number.toString(16).padStart(16, "0");
    const lowHexString = hexString.slice(8);
    const highHexString = hexString.slice(0, 8);
    const low = parseInt(lowHexString, 16);
    const high = parseInt(highHexString, 16);
    const result = {
        low,
        high,
        unsigned: false
    };
    return result;
}
