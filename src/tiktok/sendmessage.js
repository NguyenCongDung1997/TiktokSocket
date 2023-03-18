import Encode from './encode'
import bodyRequest from './bodyRequest'
import { typeSend } from './config';
import RequestTiktok from './request';

const protobuf = require("protobufjs");

class SendTiktok {
    constructor(dataShop) {
        this.bodyReq = new bodyRequest(dataShop),
        this.dataShop = dataShop
    }
    async run(socket) {
        // let ListConversation = await this.getConversation()
        // console.log(ListConversation);
        // if(ListConversation?.error_desc == "OK")
        // {
        //     let conversation = ListConversation?.body?.messages_per_user_init_v2_body?.conversations[0]
        //     console.log(conversation);
        //     this.dataShop.conversation = conversation
        //     new SendTiktok(this.dataShop).sendMessage(socket);
        // }
    }
    async sendMessage(socket) {

        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(this.bodyReq.rawBody(typeSend.SEND_MESSAGE), t).finish());
        this.sendWs(payload, socket);
    }
    async getConversation() {
        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(this.bodyReq.rawBody(typeSend.GET_MESSAGES_BY_USER_INIT_V2), t).finish());
        console.log(payload, "payload");
        await RequestTiktok.GetByUserInit(payload);
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

}
export default SendTiktok;

