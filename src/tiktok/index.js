import MD5 from 'md5';
import SendTiktok from './send';
import ResMessageSocket from './response';
class Tiktok {
    async run() {
        let option = {
            appKey: "b42d99769353ce6304e74fb597e36e90",
            fpId: 92,
            appId: 5341,
            stringKey: "f8a69f1719916z"
        };
        let shopIdApp;
        let shopIdSocket;
        let pigeonShopId;
        let tokenSocket = "";
        let accessKey = "";

        var myHeaders = new Headers();
        myHeaders.append("authority", "seller-vn.tiktok.com");
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("content-type", "application/json");

        var requestOptionsGetShopAndCsInfo = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch(
            "https://seller-vn.tiktok.com/chat/api/seller/getShopAndCsInfo?PIGEON_BIZ_TYPE=1",
            requestOptionsGetShopAndCsInfo
        )
            .then((res) => res.json())
            .then((res) => {
                shopIdApp = res.data.outerShopId;
                shopIdSocket = res.data.customerServiceInfo.pigeonCid;
                pigeonShopId = res.data.pigeonShopId;
                var value = option.fpId + option.appKey + shopIdSocket + option.stringKey;
                accessKey = MD5(value);
                /////
                var requestOptionsSellerToken = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                fetch(`https://seller-vn.tiktok.com/chat/api/seller/token?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}`,
                    requestOptionsSellerToken)
                    .then((resToken) => resToken.json())
                    .then(resToken => {
                        tokenSocket = resToken.data.token;
                        console.log('tokenSocket', tokenSocket);
                        /////
                        let socket = new WebSocket(
                            `wss://oec-im-frontier-va.tiktokglobalshop.com/ws/v2?token=${tokenSocket}&aid=${option.appId}&fpid=${option.fpId}&device_id=${shopIdSocket}&access_key=${accessKey}&device_platform=web&version_code=10000&websocket_switch_region=VN`
                        );

                        new SendTiktok({ shopIdSocket, tokenSocket, pigeonShopId }).run(socket);
                        ResMessageSocket.ResMessageSocket(socket, myHeaders, shopIdApp)
                    })
                    .catch(error => console.log('error', error));
            })
            .catch((error) => console.log("error", error));
    }
}
export default (new Tiktok());