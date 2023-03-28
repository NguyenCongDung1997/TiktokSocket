import Encode from './encode'
import bodyRequest from './bodyRequest'
import { typeSend } from './config';
import RequestTiktok from './request';
import MD5 from 'md5';

const protobuf = require("protobufjs");

class SendTiktok {
    // async run(uuid, conversation) {
    //     let conversationStorage = await localStorage.getItem("conversatisonTiktok");
    //     const conversationList = JSON.parse(conversationStorage);
    //     this.dataShop.conversation = conversationList[conversation.conversationId]
    //     new SendTiktok(this.dataShop).sendMessage();
    // }
    // async sendMessage(socket) {
    //     const robotId = await RequestTiktok.GetRobotConfig(this.shopIdApp);
    //     const greetingList = await RequestTiktok.GetGreetingList(this.shopIdApp, robotId)
    //     const content = await greetingList.find(x => x.type === 2).greetingText;
    //     let t = new protobuf.Writer();
    //     let payload = new Uint8Array(Encode.encodeMess(this.bodyReq.rawBody(typeSend.SEND_MESSAGE, content), t).finish());
    //     this.sendWs(payload, socket);
    // }
    async sendMessage(shopIdApp, uuid, conversationId) {
        let conversationStorage = await localStorage.getItem("conversatisonTiktok");
        const conversationList = JSON.parse(conversationStorage);
        const conversation = conversationList[conversationId]

        const bodyReq = new bodyRequest({ conversation, uuid })
        const robotId = await RequestTiktok.GetRobotConfig(shopIdApp);
        const greetingList = await RequestTiktok.GetGreetingList(shopIdApp, robotId)
        const content = await greetingList.find(x => x.type === 2).greetingText;
        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(bodyReq.rawBody(typeSend.SEND_MESSAGE, content), t).finish());
        console.log(payload, "payload");
        await RequestTiktok.Sendmess(payload);
    }
    async getConversation() {
        const bodyReq = new bodyRequest()
        let t = new protobuf.Writer();
        let payload = new Uint8Array(Encode.encodeMess(bodyReq.rawBody(typeSend.GET_MESSAGES_BY_USER_INIT_V2), t).finish());
        console.log(payload, "payload");
        await RequestTiktok.GetByUserInit(payload);
    }

    async sendWs(payload, socket) {

        const p = new protobuf.Writer();
        const keyXMSSTUB = {
            "X-MS-STUB": MD5(payload)
        };
        const keyXBogus = window.byted_acrawler.frontierSign(keyXMSSTUB);

        const send = new Uint8Array(Encode.encodeBodyPayload(this.bodyReq.bodyPayload(payload, keyXBogus["X-Bogus"]), p).finish());
        console.log(send, socket, payload, "send");
        socket.binaryType = 'arraybuffer';

        socket.send(send)

    }

}
export default (new SendTiktok());

