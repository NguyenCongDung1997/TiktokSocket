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
        } = await RequestTiktok.GetShopAndCsInfo();

        const accessKey = MD5(option.fpId + option.appKey + shopIdSocket + option.stringKey);

        const tokenSocket = await RequestTiktok.GetToken(shopIdApp);

        const socket = new WebSocket(
            `wss://oec-im-frontier-va.tiktokglobalshop.com/ws/v2?token=${tokenSocket}&aid=${option.appId}&fpid=${option.fpId}&device_id=${shopIdSocket}&access_key=${accessKey}&device_platform=web&version_code=10000&websocket_switch_region=VN`
        );

        RequestTiktok.ResMessageSocket(socket, shopIdApp);
        const tokenFormChat = await RequestTiktok.SearchOrder("577088024687839659", shopIdApp);
        const pigeonUid = await RequestTiktok.GetPigeonId(tokenFormChat, shopIdApp);
        const conversation = await RequestTiktok.CreateGroupChat(pigeonUid, shopIdApp);
        console.log(conversation);
        const sendTiktok = new SendTiktok({ shopIdSocket, tokenSocket, pigeonShopId,shopIdApp, conversation });
        await sendTiktok.getConversation();
        await sendTiktok.run(socket, conversation);

    }

}
export default (new Tiktok());