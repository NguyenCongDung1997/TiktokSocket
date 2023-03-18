import { headers } from './config';
const protobuf = require("protobufjs");

class FetchTiktok {
    async Get(url) {
        let requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };
        const resp = await fetch(url, requestOptions);
        const data = await resp.json();
        return data;
    }
    async PostJson(url, body) {
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
            redirect: 'follow'
        };

        const resp = await fetch(url, requestOptions);
        const data = await resp.json();
        return data;
    }
    async PostArrayBuffer(url, buffer) {
        var requestOptions = {
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
        };

        const resp = await fetch(url, requestOptions);
        const data = await resp.arrayBuffer();
        return data;
    }
}
export default (new FetchTiktok());

