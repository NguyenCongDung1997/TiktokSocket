import Decode from './decode'
import Api from '../core/api';
import { headers } from './config';
import FetchTiktok from './api';
const protobuf = require("protobufjs");

class RequestTiktok {

    async ResConversation(array) {
        const r = new protobuf.Reader(new Uint8Array(array));
        Decode.Response(r);
    }

    async GetToken(shopIdApp) {

        const dataToken = await FetchTiktok.Get(`https://seller-vn.tiktok.com/chat/api/seller/token?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}`);
        return dataToken.data.token;
    }
    async GetShopAndCsInfo() {

        const dataShop = await FetchTiktok.Get("https://seller-vn.tiktok.com/chat/api/seller/getShopAndCsInfo?PIGEON_BIZ_TYPE=1");
        return dataShop.data;
    }
    async SearchOrder(orderId, shopIdApp) {
        var body = JSON.stringify({
            "search_condition": {
                "condition_list": {
                    "main_order_id": {
                        "value": [
                            `${orderId}`
                        ]
                    },
                    "search_tab": {
                        "value": [
                            "0"
                        ]
                    }
                }
            },
            "offset": 0,
            "count": 20,
            "sort_info": "6",
            "pagination_type": 0
        });

        const dataOrder = await FetchTiktok.PostJson(
            `https://seller-vn.tiktok.com/api/fulfillment/order/orders_list?locale=vi-VN&language=vi-VN&oec_seller_id=${shopIdApp}&aid=4068`
            , body);
        let contact_buyer_link = dataOrder?.data?.main_orders?.filter(x => x.main_order_id == orderId)[0]?.contact_buyer_link;
        contact_buyer_link = decodeURIComponent(contact_buyer_link);
        const elements = contact_buyer_link.split('&');
        let result_dict = {}
        for (let element of elements) {
            let pair = element.split('=')
            result_dict[pair[0]] = pair[1]
        }

        return result_dict.token
    }
    async GetPigeonId(token, shopIdApp) {
        token = decodeURI(token);
        var body = JSON.stringify({
            "outerIdList": [
                `${token}`
            ],
            "outIdType": 1
        });

        const dataTokenOrder = await FetchTiktok.PostJson(
            `https://seller-vn.tiktok.com/chat/api/seller/batchGetPigeonId?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}`
            , body);
        return dataTokenOrder.data.idMap[`${token}`];
    }
    async CreateGroupChat(pigeonUid, shopIdApp) {
        var body = JSON.stringify({
            "pigeonUid": pigeonUid
        });

        const dataJson = await FetchTiktok.PostJson(
                `https://seller-vn.tiktok.com/chat/api/seller/createGroupChat?PIGEON_BIZ_TYPE=1&PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}`
                , body);
        return dataJson.data;
    }
    async GetByUserInit(payload) {
        const buffer = payload.buffer
        // const res =  await fetch("https://imapi-va-oth.isnssdk.com/v2/message/get_by_user_init", {
        //     "headers": {
        //         "accept": "application/x-protobuf",
        //         "accept-language": "vi,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi-VN;q=0.6,en-US;q=0.5",
        //         "content-type": "application/x-protobuf",
        //         "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
        //         "sec-ch-ua-mobile": "?0",
        //         "sec-ch-ua-platform": "\"Windows\"",
        //         "sec-fetch-dest": "empty",
        //         "sec-fetch-mode": "cors",
        //         "sec-fetch-site": "cross-site"
        //     },
        //     "referrer": "https://seller-vn.tiktok.com/",
        //     "referrerPolicy": "strict-origin-when-cross-origin",
        //     "body": buffer,
        //     "method": "POST",
        //     "mode": "cors",
        //     "credentials": "omit"
        // })
            // const data = await res.arrayBuffer()
            const data = await FetchTiktok.PostArrayBuffer(
                `https://imapi-va-oth.isnssdk.com/v2/message/get_by_user_init`
                , buffer);
            await this.ResConversation(data)
    }

    async ResMessageSocket(socket, shopIdApp) {
        let domainNobi = [];
        let tokenStorage = await localStorage.getItem("tokens");
        let tokens = {};
        if (tokenStorage) {
            tokens = JSON.parse(tokenStorage);
            domainNobi = Object.keys(tokens);
        }
        const regexMessage = /(?<=(,bB))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/;
        const regexUserName = /(?<=(,uname,))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/;
        const regexMessageByCustomer = /(?:x_frontier_traceid)/gi;
        socket.onmessage = function (event) {
            var reader = new FileReader();
            // reader.readAsDataURL(event.data);
            reader.onload = function () {
                const str = reader.result
                    .match(
                        /[a-zA-Z0-9_. ,ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/g
                    )
                    .toString();
                const checkMessageByCustomer = regexMessageByCustomer.test(str);
                const check = regexMessage.exec(str);
                if (check != null && checkMessageByCustomer) {
                    console.log(str);
                    const mess = check
                        ?.filter((x) => x != ",bB" && x != "J," && x != "J0," && x !== undefined)
                        .toString()
                        .replaceAll(",", " ");
                    const checkUsername = regexUserName.exec(str);
                    const username = checkUsername
                        ?.filter((x) => x != ",uname," && x != "J," && x != "J0," && x !== undefined)
                        .toString();
                    // const regexPhone = new RegExp(`(?<!\\d[1-9]{1})((?:0|o|84|63)[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){8,9}|(?:(?:\\+|00)\\d{1,4})[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){6,9})(?!\\d)`, "gi");
                    const regexPhone = new RegExp(`(?<!\\d[1-9])(?:(?:0|[oc]|84|63)[.-\\s]?[1-9](?:[.-\\s]?[0-9o]){8,9}|(?:\\+|00)\\d{1,4}[.-\\s]?[1-9](?:[.-\\s]?[0-9o]){6,9})(?!\\d)`, "gi");
                    var checkPhone = regexPhone.test(mess);
                    const regexAddress = /(?:số|đường|quốc lộ|ngách|ngã|ngõ|hẻm|thôn|xóm|phường|xã|thị trấn|đội|ấp|khu|tòa nhà|tổ|chung cư|khách sạn|nhà|làng|thị xã|kiệt|số|đường|quốc lộ|địa chỉ|dc).+(?:Lào Cai|Điện Biên|Lai Châu|Sơn La|Yên Bái|Hoà Bình|Thái Nguyên|Lạng Sơn|Quảng Ninh|Bắc Giang|Phú Thọ|Vĩnh Phúc|Bắc Ninh|Hải Dương|Hải Phòng|Hưng Yên|Thái Bình|Hà Nam|Nam Định|Ninh Bình|Thanh Hóa|Nghệ An|Hà Tĩnh|Quảng Bình|Quảng Trị|Thừa Thiên Huế|Đà Nẵng|Quảng Nam|Quảng Ngãi|Bình Định|Phú Yên|Khánh Hòa|Ninh Thuận|Bình Thuận|Kon Tum|Gia Lai|Đắk Lắk|Đắk Nông|Lâm Đồng|Bình Phước|Tây Ninh|Bình Dương|Đồng Nai|Bà Rịa - Vũng Tàu|Bà Rịa-Vũng Tàu|HCM|Hồ Chí Minh|Long An|Tiền Giang|Bến Tre|Trà Vinh|Vĩnh Long|Đồng Tháp|An Giang|Kiên Giang|Cần Thơ|Hậu Giang|Sóc Trăng|Bạc Liêu|Cà Mau|Cao Bằng|Hà Giang|Hà Nội|Tuyên Quang|Bắc Kạn)/gi;
                    var checkAddress = regexAddress.test(mess);
                    if (checkPhone || checkAddress) {
                        var rawOrder = JSON.stringify({
                            "pagination_type": 0,
                            "tab": 0,
                            "version": 2,
                            "list_condition": {
                                "sort_field": 3,
                                "sort_type": 0,
                                "usernames": [
                                    `${username}`
                                ]
                            },
                            "count": 20,
                            "offset": 0
                        });
                        ///////
                        var requestOrder = {
                            method: 'POST',
                            headers: headers,
                            body: rawOrder,
                            redirect: 'follow'
                        };
                        fetch(`https://seller-vn.tiktok.com/api/v2/trade/orders/list?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}&language=vi-VN&locale=vi-VN`, requestOrder)
                            .then((resOrder) => resOrder.json())
                            .then(resOrder => {
                                var orderId = resOrder?.data?.main_orders[0]?.main_order_id;

                                var rawNobi = {
                                    "Username": `${username}`,
                                    "Message": `${mess}`,
                                    "OrderId": `${orderId}`,
                                    "ShopId": `${shopIdApp}`
                                };
                                console.log(rawNobi);
                                domainNobi.forEach((dm) => {
                                    new Api(dm).post(`/api/tiktok/extension`, rawNobi)
                                })

                            })
                            .catch(error => console.log('error', error));
                    }
                }
            };

            if (event.currentTarget.binaryType == "blob") {
                reader.readAsText(event.data);
            }
            else if (event.currentTarget.binaryType == "arraybuffer") {
                //test tin nhắn đã gửi thành công

                // let arr = new TextDecoder().decode(new Uint8Array(event.data))
                // arr = arr.replace(/\\n/g, "\\n")
                //     .replace(/\\'/g, "\\'")
                //     .replace(/\\"/g, '\\"')
                //     .replace(/\\&/g, "\\&")
                //     .replace(/\\r/g, "\\r")
                //     .replace(/\\t/g, "\\t")
                //     .replace(/\\b/g, "\\b")
                //     .replace(/\\f/g, "\\f");
                // // Remove non-printable and other non-valid JSON characters
                // arr = arr.replace(/[\u0000-\u0019]+/g, "");
                let dataSocket = new Blob([new Uint8Array(event.data)]);
                // console.log(tesst, arr, event.data);

                // let obj = JSON.parse(JSON.stringify(arr));
                // console.log(obj);
                reader.readAsText(dataSocket);
            }
        };
    }

}

export default (new RequestTiktok());

