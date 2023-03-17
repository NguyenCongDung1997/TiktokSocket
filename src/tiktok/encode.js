class Encode {
    encodeMess(e, t) {
        if (t,
            null != e.cmd && Object.hasOwnProperty.call(e, "cmd") && t.uint32(8).int32(e.cmd),
            null != e.sequence_id && Object.hasOwnProperty.call(e, "sequence_id") && t.uint32(16).int64(e.sequence_id),
            null != e.sdk_version && Object.hasOwnProperty.call(e, "sdk_version") && t.uint32(26).string(e.sdk_version),
            null != e.token && Object.hasOwnProperty.call(e, "token") && t.uint32(34).string(e.token),
            null != e.refer && Object.hasOwnProperty.call(e, "refer") && t.uint32(40).int32(e.refer),
            null != e.inbox_type && Object.hasOwnProperty.call(e, "inbox_type") && t.uint32(48).int32(e.inbox_type),
            null != e.build_number && Object.hasOwnProperty.call(e, "build_number") && t.uint32(58).string(e.build_number),
            null != e.body && Object.hasOwnProperty.call(e, "body") && this.requestBody(e.body, t.uint32(66).fork()).ldelim(),
            null != e.device_id && Object.hasOwnProperty.call(e, "device_id") && t.uint32(74).string(e.device_id),
            null != e.channel && Object.hasOwnProperty.call(e, "channel") && t.uint32(82).string(e.channel),
            null != e.device_platform && Object.hasOwnProperty.call(e, "device_platform") && t.uint32(90).string(e.device_platform),
            null != e.device_type && Object.hasOwnProperty.call(e, "device_type") && t.uint32(98).string(e.device_type),
            null != e.os_version && Object.hasOwnProperty.call(e, "os_version") && t.uint32(106).string(e.os_version),
            null != e.version_code && Object.hasOwnProperty.call(e, "version_code") && t.uint32(114).string(e.version_code),
            null != e.headers && Object.hasOwnProperty.call(e, "headers"))
            for (var n = Object.keys(e.headers), r = 0; r < n.length; ++r)
                t.uint32(122).fork().uint32(10).string(n[r]).uint32(18).string(e.headers[n[r]]).ldelim();
        return null != e.config_id && Object.hasOwnProperty.call(e, "config_id") && t.uint32(128).int32(e.config_id),
            null != e.token_info && Object.hasOwnProperty.call(e, "token_info") && this.token(e.token_info, t.uint32(138).fork()).ldelim(),
            null != e.auth_type && Object.hasOwnProperty.call(e, "auth_type") && t.uint32(144).int32(e.auth_type),
            t
    }

    requestBody(e, t) {
        return t,
            null != e.send_message_body && Object.hasOwnProperty.call(e, "send_message_body") && this.sendMessageRequestBody(e.send_message_body, t.uint32(802).fork()).ldelim(),
            null != e.messages_per_user_body && Object.hasOwnProperty.call(e, "messages_per_user_body") && this.messagesPerUserRequestBody(e.messages_per_user_body, t.uint32(1602).fork()).ldelim(),
            null != e.messages_per_user_init_v2_body && Object.hasOwnProperty.call(e, "messages_per_user_init_v2_body") && this.messagesPerUserInitV2RequestBody(e.messages_per_user_init_v2_body, t.uint32(1626).fork()).ldelim(),
            t
    }
    sendMessageRequestBody(e, t) {
        if (t,
            null != e.conversation_id && Object.hasOwnProperty.call(e, "conversation_id") && t.uint32(10).string(e.conversation_id),
            null != e.conversation_type && Object.hasOwnProperty.call(e, "conversation_type") && t.uint32(16).int32(e.conversation_type),
            null != e.conversation_short_id && Object.hasOwnProperty.call(e, "conversation_short_id") && t.uint32(24).int64(e.conversation_short_id),
            null != e.content && Object.hasOwnProperty.call(e, "content") && t.uint32(34).string(e.content),
            null != e.ext && Object.hasOwnProperty.call(e, "ext"))
            for (var n = Object.keys(e.ext), r = 0; r < n.length; ++r)
                t.uint32(42).fork().uint32(10).string(n[r]).uint32(18).string(e.ext[n[r]]).ldelim();
        if (null != e.message_type && Object.hasOwnProperty.call(e, "message_type") && t.uint32(48).int32(e.message_type),
            null != e.ticket && Object.hasOwnProperty.call(e, "ticket") && t.uint32(58).string(e.ticket),
            null != e.client_message_id && Object.hasOwnProperty.call(e, "client_message_id") && t.uint32(66).string(e.client_message_id),
            null != e.mentioned_users && e.mentioned_users.length)
            for (r = 0; r < e.mentioned_users.length; ++r)
                t.uint32(72).int64(e.mentioned_users[r]);
        return null != e.ref_msg_info && Object.hasOwnProperty.call(e, "ref_msg_info") && this.referencedMessageInfo(e.ref_msg_info, t.uint32(90).fork()).ldelim(),
            t
    }
    referencedMessageInfo(e, t) {
        return t,
            t.uint32(8).int64(e.referenced_message_id),
            t.uint32(18).string(e.hint),
            null != e.root_message_id && Object.hasOwnProperty.call(e, "root_message_id") && t.uint32(24).int64(e.root_message_id),
            null != e.root_message_conv_index && Object.hasOwnProperty.call(e, "root_message_conv_index") && t.uint32(32).int64(e.root_message_conv_index),
            t
    }
    token(e, t) {
        return t || (t = new protobuf.Writer()),
            null != e.mark_id && Object.hasOwnProperty.call(e, "mark_id") && t.uint32(8).int32(e.mark_id),
            null != e.type && Object.hasOwnProperty.call(e, "type") && t.uint32(16).int32(e.type),
            null != e.app_id && Object.hasOwnProperty.call(e, "app_id") && t.uint32(24).int32(e.app_id),
            null != e.user_id && Object.hasOwnProperty.call(e, "user_id") && t.uint32(32).int64(e.user_id),
            null != e.timestamp && Object.hasOwnProperty.call(e, "timestamp") && t.uint32(40).int64(e.timestamp),
            t
    }
    messagesPerUserRequestBody(e, t) {
        return t || (t = a.create()),
            null != e.cursor && Object.hasOwnProperty.call(e, "cursor") && t.uint32(8).int64(e.cursor),
            null != e.limit && Object.hasOwnProperty.call(e, "limit") && t.uint32(16).int32(e.limit),
            t
    }
    messagesPerUserInitV2RequestBody(e, t) {
        return t || (t = a.create()),
            null != e.cursor && Object.hasOwnProperty.call(e, "cursor") && t.uint32(8).int64(e.cursor),
            null != e.new_user && Object.hasOwnProperty.call(e, "new_user") && t.uint32(16).int32(e.new_user),
            null != e.init_sub_type && Object.hasOwnProperty.call(e, "init_sub_type") && t.uint32(24).int32(e.init_sub_type),
            t
    }
    encodeBodyPayload(e, t) {
        if (t,
            t.uint32(8).uint64(e.seqid),
            t.uint32(16).uint64(e.logid),
            t.uint32(24).int32(e.service),
            t.uint32(32).int32(e.method),
            null != e.headers && e.headers.length)
            for (var n = 0; n < e.headers.length; ++n)
                this.extendedEntry(e.headers[n], t.uint32(42).fork()).ldelim();
        return null != e.payload_encoding && Object.hasOwnProperty.call(e, "payload_encoding") && t.uint32(50).string(e.payload_encoding),
            null != e.payload_type && Object.hasOwnProperty.call(e, "payload_type") && t.uint32(58).string(e.payload_type),
            null != e.payload && Object.hasOwnProperty.call(e, "payload") && t.uint32(66).bytes(e.payload),
            t
    }
    extendedEntry(e, t) {
        return t,
            t.uint32(10).string(e.key),
            t.uint32(18).string(e.value),
            t
    }
}
export default (new Encode())