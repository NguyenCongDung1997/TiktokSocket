import Encode from './encode'
import bodyRequest from './bodyRequest'
import { typeSend } from './config';
import ResponseTiktok from './response';
const protobuf = require("protobufjs");

class SendTiktok {
    constructor(dataShop) {
        this.bodyReq = new bodyRequest(dataShop),
        this.dataShop = dataShop
    }
    async run(socket) {
        let ListConversation = await this.getConversation()
        console.log(ListConversation);
        if(ListConversation?.error_desc == "OK")
        {
            let conversation = ListConversation?.body?.messages_per_user_init_v2_body?.conversations[0]
            console.log(conversation);
            this.dataShop.conversation = conversation
            new SendTiktok(this.dataShop).sendMessage(socket);
        }
    }
    async sendMessage(socket) {

        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(this.bodyReq.rawBody(typeSend.SEND_MESSAGE), t).finish());
        // this.sendWs(payload, socket);
    }
    async getConversation() {
        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(this.bodyReq.rawBody(typeSend.GET_MESSAGES_BY_USER_INIT_V2), t).finish());
        console.log(payload, "payload");
        return await this.sendHttp(payload);
    }

    async sendWs(payload, socket) {

        const p = new protobuf.Writer();
        const send = new Uint8Array(Encode.encodeBodyPayload(this.bodyReq.bodyPayload(payload), p).finish());
        console.log(send,socket,payload,"send");
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            socket.send(send)
            // console.log(o);
        };

    }
    async sendHttp(payload) {
        let data;
        const buffer = payload.buffer
        await fetch("https://imapi-va-oth.isnssdk.com/v2/message/get_by_user_init", {
            "headers": {
                "accept": "application/x-protobuf",
                "accept-language": "vi,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi-VN;q=0.6,en-US;q=0.5",
                "content-type": "application/x-protobuf",
                "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://seller-vn.tiktok.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": buffer,
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        }).then(res => res.arrayBuffer())
            .then(res => {
                data = ResponseTiktok.ResConversationn(res)
            });
        return data;
    }

}
export default SendTiktok;

