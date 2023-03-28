import { uuidv4 } from '../libs/utils';
import { typeSend } from './config';
import {long} from "./config";
import './webmssdk';

const r = {
    version: "0.3.8",
    branch: "master",
    commit: "12c929a"
};


const messages_per_user_init_v2_body = {
    "messages_per_user_init_v2_body": {
        "cursor": {
            "low": 0,
            "high": 0,
            "unsigned": false
        }
    }
}

class bodyRequest {
    constructor(data) {
        this.conversation = data?.conversation;
        this.uuid = data?.uuid;
        this.init();
    }
    init() {
        const str = localStorage.getItem("tiktok");
        if (str) {
            const json = JSON.parse(str);
            Object.entries(json).map(([key, value]) => {
                this[key] = value;
            });
        };
    }
    send_message_body(content) {
        
        const obj = {
            "send_message_body": {
                "conversation_id": this.conversation?.conversation_id,
                "conversation_short_id": long(this.conversation?.conversation_id),
                "conversation_type": 2,
                "content": content,
                "mentioned_users": [],
                "client_message_id": this.uuid,
                "ticket": this.conversation?.ticket,
                "message_type": 1000,
                "ext": {
                    "PIGEON_BIZ_TYPE": "1",
                    "monitor_send_message_platform": "pc",
                    "monitor_send_message_start_time": Math.floor(new Date().getTime()),
                    "type": "text",
                    "original_content": content,
                    "detect_lang": "",
                    "sender_role": "2",
                    "a:user_language": "vi",
                    "shop_region": "VN",
                    "target_lang": "vi",
                    "source_lang": "zh-CN",
                    "shop_id": this.pigeonShopId,
                    "is_cross_board": "0",
                    "cross_board_region": "",
                    "s:mentioned_users": "",
                    "s:client_message_id": this.uuid
                }
            }
        }
        return obj;
    }
    rawBody(type, content) {
        let body;
        let cmd;
        switch (type) {
            case typeSend.SEND_MESSAGE:
                body = this.send_message_body(content);
                cmd = 100;
                break;
            case typeSend.GET_MESSAGES_BY_USER_INIT_V2:
                body = messages_per_user_init_v2_body;
                cmd = 203;
                break;
        }
        const obj = {
            "headers": {},
            "body": body,
            "cmd": cmd,
            "sequence_id": {
                "low": 10001,
                "high": 0,
                "unsigned": false
            },
            "refer": 3,
            "token": this.tokenSocket,
            "device_id": this.shopIdSocket,
            "sdk_version": "0.3.8",
            "build_number": "12c929a:master",
            "inbox_type": 0,
            "device_platform": "web",
            "auth_type": 2
        }
        console.log(obj);
        return obj;
    }
    bodyPayload(payload, XBogus) {
        const obj = {
            "headers": [
                {
                    "key": "X-Bogus",
                    "value": XBogus
                }
            ],
            "service": 10002,
            "method": 1,
            "seqid": {
                "low": 10001,
                "high": 0,
                "unsigned": false
            },
            "logid": Math.floor(new Date().getTime()),
            "payload_type": "pb",
            "payload": payload
        }
        return obj;
    }
}


export default bodyRequest