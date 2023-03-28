class Decode {
    constructor() {
        this.res = {},
            this.messagesPerUserInitV2ResponseBody = {},
            this.bodyResponse = {},
            this.conversationInfoV2 = {},
            this.conversation = []
    }
    async Response(e, t) {
        for (var n, r, o = t === undefined ? e.len : e.pos + t, a = this.res; e.pos < o;) {
            var u = e.uint32();
            switch (u >>> 3) {
                case 1:
                    a.cmd = e.int32();
                    break;
                case 2:
                    a.sequence_id = e.int64();
                    break;
                case 3:
                    a.status_code = e.int32();
                    break;
                case 4:
                    a.error_desc = e.string();
                    break;
                case 5:
                    a.inbox_type = e.int32();
                    break;
                case 6:
                    a.body = await this.BodyResponse(e, e.uint32());
                    break;
                case 7:
                    a.log_id = e.string();
                    break;
                case 8:
                    a.headers === s.emptyObject && (a.headers = {});
                    var l = e.uint32() + e.pos;
                    for (n = "",
                        r = ""; e.pos < l;) {
                        var f = e.uint32();
                        switch (f >>> 3) {
                            case 1:
                                n = e.string();
                                break;
                            case 2:
                                r = e.string();
                                break;
                            default:
                                e.skipType(7 & f)
                        }
                    }
                    a.headers[n] = r;
                    break;
                case 9:
                    a.start_time_stamp = e.int64();
                    break;
                case 10:
                    a.request_arrived_time = e.int64();
                    break;
                case 11:
                    a.server_execution_end_time = e.int64();
                    break;
                default:
                    e.skipType(7 & u)
            }
        }
        return a
    }
    async BodyResponse(e, t) {
        for (var n = t === undefined ? e.len : e.pos + t, r = this.bodyResponse; e.pos < n;) {
            var o = e.uint32();
            switch (o >>> 3) {
                case 100:
                    r.send_message_body = await this.SendMessageResponseBody(e, e.uint32());
                    break;
                case 200:
                    r.messages_per_user_body = c.im_proto.MessagesPerUserResponseBody.decode(e, e.uint32());
                    break;
                case 203:
                    r.messages_per_user_init_v2_body = await this.MessagesPerUserInitV2ResponseBody(e, e.uint32());
                    break;
                default:
                    e.skipType(7 & o)
            }
        }
        return r
    }

    async SendMessageResponseBody(e, t) {
        for (
            var n = t === undefined ? e.len : e.pos + t,
            r = {};
            e.pos < n;

        ) {
            var o = e.uint32();
            switch (o >>> 3) {
                case 1:
                    r.server_message_id = e.int64();
                    break;
                case 2:
                    r.extra_info = e.string();
                    break;
                case 3:
                    r.status = e.int32();
                    break;
                case 4:
                    r.client_message_id = e.string();
                    break;
                case 5:
                    r.check_code = e.int64();
                    break;
                case 6:
                    r.check_message = e.string();
                    break;
                default:
                    e.skipType(7 & o);
            }
        }
        return r;
    }


    async MessagesPerUserInitV2ResponseBody(e, t) {
        for (var n = t === undefined ? e.len : e.pos + t, r = {}; e.pos < n;) {
            var o = e.uint32();
            switch (o >>> 3) {
                // case 1:
                //     r.messages && r.messages.length || (r.messages = []),
                //     r.messages.push(c.im_proto.MessageBody.decode(e, e.uint32()));
                //     break;
                case 2:
                    r.conversations && r.conversations.length || (r.conversations = []),
                        r.conversations.push(await this.ConversationInfoV2(e, e.uint32()));
                    break;
                case 3:
                    r.per_user_cursor = e.int64();
                    break;
                case 4:
                    r.next_cursor = e.int64();
                    break;
                case 5:
                    r.has_more = e.bool();
                    break;
                default:
                    e.skipType(7 & o)
            }
        }
        return r
    }
    async ConversationInfoV2(e, t) {
        for (var n = t === undefined ? e.len : e.pos + t, r = this.conversationInfoV2; e.pos < n;) {
            var o = e.uint32();
            switch (o >>> 3) {
                case 1:
                    r.conversation_id = e.string();
                    break;
                case 2:
                    r.conversation_short_id = e.int64();
                    break;
                case 3:
                    r.conversation_type = e.int32();
                    break;
                case 4:
                    r.ticket = e.string();
                    break;
                // case 6:
                //     r.first_page_participants = c.im_proto.ParticipantsPage.decode(e, e.uint32());
                //     break;
                case 7:
                    r.participants_count = e.int32();
                    break;
                case 8:
                    r.is_participant = e.bool();
                    break;
                case 9:
                    r.inbox_type = e.int32();
                    break;
                // case 20:
                //     r.user_info = c.im_proto.Participant.decode(e, e.uint32());
                //     break;
                // case 50:
                //     r.conversation_core_info = c.im_proto.ConversationCoreInfo.decode(e, e.uint32());
                //     break;
                // case 51:
                //     r.conversation_setting_info = c.im_proto.ConversationSettingInfo.decode(e, e.uint32());
                //     break;
                default:
                    e.skipType(7 & o)
            }
        }
        let conversationStorage = await localStorage.getItem("conversatisonTiktok");
        let conversations = {};
        if (conversationStorage) {
            conversations = JSON.parse(conversationStorage);
        }
        conversations[r.conversation_id] = r;
        localStorage.setItem("conversatisonTiktok", JSON.stringify(conversations));
        console.log(r);
        return r
    }

}
export default (new Decode())