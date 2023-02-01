let option = {
    appKey: "b42d99769353ce6304e74fb597e36e90",
    fpId: 92,
    appId: 5341,
    stringKey: "f8a69f1719916z"
};
let strCookies = "";
let shopIdApp;
let shopIdSocket;
let tokenSocket = "";
let accessKey = "";

chrome.cookies.getAll(
    {
        domain: ".ecrm.vn"
    },
    function (cookies) {
        cookies.forEach((x) => {
            console.log(x);
        });
    }
);
chrome.cookies.getAll(
    {
        domain: ".nobi.pro"
    },
    function (cookies) {
        cookies.forEach((x) => {
            console.log(x);
        });
    }
);

var MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ };

chrome.cookies.getAll(
    {
        domain: ".seller-vn.tiktok.com",
    },
    async function (cookies) {
        cookies.forEach((x) => {
            console.log(x);
            strCookies += x.name + "=" + x.value + ";";
        });

        var myHeaders = new Headers();
        myHeaders.append("authority", "seller-vn.tiktok.com");
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append(
            "accept-language",
            "vi,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi-VN;q=0.6,en-US;q=0.5"
        );
        myHeaders.append("content-type", "application/json");
        myHeaders.append("cookie", strCookies);
        myHeaders.append(
            "sec-ch-ua",
            '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"'
        );
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", '"Windows"');
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-origin");
        myHeaders.append(
            "user-agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        );
        /////
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
                console.log(shopIdApp);
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
                        const regexMessage = /(?<=(,bB))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/;
                        const regexUserName = /(?<=(,uname,))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/;
                        socket.onmessage = function (event) {
                            var reader = new FileReader();
                            // reader.readAsDataURL(event.data);
                            reader.onload = function () {
                                const str = reader.result
                                    .match(
                                        /[a-zA-Z0-9_. ,ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/g
                                    )
                                    .toString();
                                const check = regexMessage.exec(str);
                                if (check != null) {
                                    console.log(str);
                                    const mess = check
                                        ?.filter((x) => x != ",bB" && x != "J," && x != "J0," && x !== undefined)
                                        .toString()
                                        .replaceAll(",", " ");
                                    const checkUsername = regexUserName.exec(str);
                                    const username = checkUsername
                                        ?.filter((x) => x != ",uname," && x != "J," && x != "J0," && x !== undefined)
                                        .toString();
                                    const regexPhone = new RegExp(`(?:\\D|^)((?:0|o)[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){8,9}|(?:(?:\\+|00)\\d{1,4})[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){6,9})(?!\\d)`, "gi");
                                    var checkPhone = regexPhone.test(mess);
                                    if(checkPhone)
                                    {
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
    
                                        var requestOrder = {
                                            method: 'POST',
                                            headers: myHeaders,
                                            body: rawOrder,
                                            redirect: 'follow'
                                        };
                                        fetch(`https://seller-vn.tiktok.com/api/v2/trade/orders/list?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=${shopIdApp}&language=vi-VN&locale=vi-VN`, requestOrder)
                                            .then((resOrder) => resOrder.json())
                                            .then(resOrder => {
                                                console.log('resOrder', resOrder)
                                                var orderId = resOrder.data?.main_orders[0]?.main_order_id;
                                                console.log('orderId', orderId)
                                            })
                                            .catch(error => console.log('error', error));
                                    }
                                }
                            };
                            reader.readAsText(event.data);
                        };
                    })
                    .catch(error => console.log('error', error));
            })
            .catch((error) => console.log("error", error));
    }
);
// chrome.storage.local.get('channels', function (result) {
//     console.log(result);
// });
