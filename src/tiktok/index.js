import MD5 from 'md5';
import SendTiktok from './sendmessage';
import RequestTiktok from './request';
import { option } from './config';
class Tiktok {

    async run() {
        const {
            outerShopId: shopIdApp,
            customerServiceInfo: { pigeonCid: shopIdSocket },
            pigeonShopId,
            shopName
        } = await RequestTiktok.GetShopAndCsInfo();

        const accessKey = MD5(option.fpId + option.appKey + shopIdSocket + option.stringKey);

        const tokenSocket = await RequestTiktok.GetToken(shopIdApp);

        const socket = new WebSocket(
            `wss://oec-im-frontier-va.tiktokglobalshop.com/ws/v2?token=${tokenSocket}&aid=${option.appId}&fpid=${option.fpId}&device_id=${shopIdSocket}&access_key=${accessKey}&device_platform=web&version_code=10000&websocket_switch_region=VN`
        );
        let info = { shopIdApp, shopIdSocket, pigeonShopId, tokenSocket, shopName };
        localStorage.setItem("tiktok", JSON.stringify(info));
        RequestTiktok.ResMessageSocket(socket, shopIdApp);
    }

    async sendMessage(data) {
        console.log(data,"datasendmesss");
        const checkInfo = await localStorage.getItem("tiktok");
        if (checkInfo) {
            let infoShop = JSON.parse(checkInfo)
            const orderId = data.bodyHook.order_id
            const uuid = data.uuid
            const tokenFormChat = await RequestTiktok.SearchOrder(orderId, infoShop.shopIdApp);
            const pigeonUid = await RequestTiktok.GetPigeonId(tokenFormChat, infoShop.shopIdApp);
            const conversation = await RequestTiktok.CreateGroupChat(pigeonUid, infoShop.shopIdApp);
            console.log(conversation,"sssss");
            await SendTiktok.getConversation();
            await SendTiktok.sendMessage(infoShop.shopIdApp, uuid ,conversation.conversationId);
        }
        else{
            await this.run();
            this.sendMessage(data);
        }
    }

}
export default (new Tiktok());