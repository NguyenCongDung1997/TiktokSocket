import Decode from './decode'
import Api from '../core/api';
const protobuf = require("protobufjs");

class ResponseTiktok {

    async ResConversationn(array) {
        const r = new protobuf.Reader(new Uint8Array(array));
        let listConvertion = Decode.Response(r);
        return listConvertion;
    }

    async ResMessageSocket(socket, myHeaders, shopIdApp) {
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
                            headers: myHeaders,
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
            else if (event.currentTarget.binaryType == "arraybuffer"){
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
export default (new ResponseTiktok());

