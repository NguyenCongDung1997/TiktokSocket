// import FacebookGraph from './graph';
import { GetModule, calcJazoest, generateOfflineThreadingID, makeParsable } from './utils';
import webSession from './websession';
import AutoQueue from '../libs/queue';
import workerMessage from '../core/message';
import Api from '../core/api';
import { getFileName } from '../libs/utils';
import { errors } from './const';

class FacebookSdk {

    constructor() {
        this.init();
        this.resouces = new Map();
        this.requestCount = 50;
        this.queue = new AutoQueue();
        this.uploadCount = 1024;
    }

    init() {
        this.pages = {};
        this.ctx = {
            userId: null
        };
        this.Env = {};
        this.sprinkle_config = {};
        this.siteData = {};
        this.serverNonce = {};
        this.webConnectionClassServerGuess = {};
        this.mercuryServerRequestsConfig = {};
        this.lastLoadAt = null;
        this.docIds = {};

        const str = localStorage.getItem("facebook_resouces");
        if (str) {
            const json = JSON.parse(str);
            Object.entries(json).map(([key, value]) => {
                this[key] = value;
            });
        };

    }

    storage() {
        const { siteData, serverNonce, lastLoadAt, sprinkle_config, Env, ctx, pages, webConnectionClassServerGuess, mercuryServerRequestsConfig, docIds } = this;
        localStorage.setItem("facebook_resouces", JSON.stringify({ siteData, serverNonce, lastLoadAt, sprinkle_config, Env, ctx, pages, webConnectionClassServerGuess, mercuryServerRequestsConfig, docIds }));
    }

    async preLoadHTML(pageId) {
        if (!this.lastLoadAt || (this.lastLoadAt < (new Date().getTime() / 1000) - 3600)) {

            const url = new URL("https://business.facebook.com/latest/inbox/all");
            // await fetch("https://m.facebook.com?_=" + new Date().getTime());

            if (pageId) url.searchParams.append("asset_id", pageId);

            const resp = await fetch(url.href, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                },
                "mode": "cors",
                "credentials": "include"
            });

            const html = await resp.text();

            this.setPages(html);
            this.setUserId(html);
            this.setEnv(html);
            this.setCtx(html);
            await this.setResource(html);
            await this.setDocId();
            this.lastLoadAt = new Date().getTime() / 1000;
            this.storage();
        }

        workerMessage.send("UPDATE_PAGE_LIST", {
            pages: this.pages
        });
    }

    hasPage(pageId) {
        return this.pages.some(x => x.id == pageId);
    }

    buildParam() {

        const params = {
            [this.sprinkle_config.param_name]: calcJazoest(this.ctx.dstg, this.sprinkle_config),
            "__user": this.ctx.userId,
            "__a": 1,
            "__req": (this.requestCount++).toString(36),
            "fb_dtsg": this.ctx.dstg,
            "__beoa": this.siteData.be_one_ahead ? 1 : 0,
            "__pc": this.siteData.pkg_cohort,
            "dpr": this.siteData.pr,
            "__hsi": this.siteData.hsi,
            "__comet_req": this.siteData.is_comet ? 1 : 0,
            "__rev": this.siteData.client_revision,
            "__csr": ""
        }

        if (this.siteData.spin) {
            params["__spin_r"] = this.siteData.__spin_r;
            params["__spin_t"] = this.siteData.__spin_t;
            params["__spin_b"] = this.siteData.__spin_b;
        }
        if (this.siteData.__spin_dev_mhenv) {
            params["__spin_dev_mhenv"] = this.siteData.__spin_dev_mhenv;
        }
        if (this.siteData.force_blue) {
            params["force_blue"] = 1;
        }
        if (this.webConnectionClassServerGuess) {
            params["__ccg"] = this.webConnectionClassServerGuess.connectionClass;
        }

        return params;
    }

    async createOrder(params) {
        try {
            const resp = await this.queue.enqueue(async () => await this.processCreateOrder(params));
            // workerMessage.send("SEND_MESSAGE_SUCCESS", params);
            return resp;
        } catch (e) {
            console.log("Can' create order", e);
            // workerMessage.send("SEND_MESSAGE_FAIL", params);
        }
    }

    async processCreateOrder(params) {
        let { pageId, uid, threadKey, total } = params;
        return new Promise(async (resolve, reject) => {
            try {
                // if (this.lastLoadAt && !this.hasPage(pageId)) {
                //     return reject("Can't has permission on this page");
                // }
                await this.preLoadHTML(pageId);
                if (!uid) {
                    try {
                        uid = await this.processGetUid({
                            pageId,
                            threadKey
                        });
                    } catch (e) {
                        reject(e);
                        return;
                    }
                }
                if (!uid) {
                    reject("Can't load UID");
                    return;
                }

                let formParams = this.buildParam();

                const url = new URL("https://business.facebook.com/webgraphql/mutation/");
                url.searchParams.append("doc_id", this.docIds["FBPaymentsInvoiceCreationMutation"]);
                url.searchParams.append("__a", 1);

                const orderData = {
                    "input": {
                        "client_mutation_id": "www",
                        "actor_id": pageId,
                        "client": "pages_commerce",
                        "seller_id": pageId, "buyer_id": uid,
                        "is_buyer_initialized": false,
                        "items": [{
                            "id": null,
                            "title": "Amount",
                            "subtitle": null,
                            "currency_amount": { "currency": "VND", "amount": total },
                            "quantity": "1",
                            "type": "customized",
                            "photo_ids": null
                        }],
                        "custom_shipping_options": null,
                        "notes": "",
                        "invoice_type": "payment_request",
                        "invoice_status": null,
                        "xmat_mid": null,
                        "referrer": "invoice_button",
                        "interaction_id": null,
                        "discount": { "currency": "VND", "amount": 0 },
                        "trigger_id": null
                    }
                }

                url.searchParams.append("variables", JSON.stringify(orderData));

                const formData = new FormData();

                Object.entries(formParams).map(([k, v]) => {
                    formData.append(k, v);
                });

                const resp = await fetch(url, {
                    method: "POST",
                    body: formData,
                    dataType: "text",
                    mode: "cors",
                    headers: this.MercuryServerRequestsConfig
                        ? {
                            "X-MSGR-Region": this.MercuryServerRequestsConfig.msgrRegion,
                        }
                        : {},
                });

                const respData = await resp.text();

                resolve({
                    uid,
                    ...respData,
                });

            } catch (e) {
                console.group("Can't send message")
                console.log(e);
                console.groupEnd();
                reject(e)
            }
        });
    }

    getQueries(queries) {
        queries = queries.map((x, index) => ["__q" + index + "__", x]);
        return JSON.stringify(Object.fromEntries(queries));
    }

    async getUid(params) {
        try {
            const id = await this.queue.enqueue(async () => await this.processGetUid(params));
            const { psid, domain } = params;
            await new Api(domain).put(`/api/extension/${psid}/uid`, {
                uid: id
            })
            return id;
        } catch (e) {
            workerMessage.send("GET_UID_FAIL", params)
            console.log("Can't load UID", e);
        }
        return null;
    }
    async sendMessage(params) {
        try {
            const resp = await this.queue.enqueue(() => this.processSendMessage(params));
            workerMessage.send("SEND_FB_MESSAGE_SUCCESS", {
                message: params
            });
            return resp;
        } catch (e) {
            console.log("Can' Send Message", e);
            workerMessage.send("SEND_FB_MESSAGE_SUCCESS", {
                message: params,
                error: e
            });
        }
    }

    async getFile(url) {
        const res = await fetch(url);
        const blob = await res.blob();
        const fileName = getFileName(url);
        return new File([blob], fileName, {
            type: blob.type
        });
    }

    async uploadFile(file, pageId, index = 0) {
        return new Promise(async (resolve, reject) => {
            await this.preLoadHTML(pageId);
            const params = this.buildParam();
            const url = new URL("https://upload-business.facebook.com/ajax/mercury/upload.php");
            Object.entries(params).map(([key, value]) => {
                url.searchParams.append(key, value);
            })
            url.searchParams.append("request_user_id", pageId)
            const formData = new FormData();

            formData.append("upload_" + this.uploadCount + index, file);
            const resp = await fetch(url, {
                body: formData,
                "method": "POST",
                "credentials": "include"
            });
            const data = makeParsable(await resp.text());
            const json = JSON.parse(data);
            if (json.errorDescription) {
                reject(json.errorDescription);
                return;
            }
            this.uploadCount++;

            resolve({
                type: json.payload.metadata[0].filetype,
                id: json.payload.metadata[0].fbid || json.payload.metadata[0].file_id
                    || json.payload.metadata[0].image_id
                    || json.payload.metadata[0].video_id
                    || json.payload.metadata[0].gif_id,
                name: json.payload.metadata[0].filename
            });
        })
    }

    async uploadFiles(files, pageId) {
        const filesData = [];
        await Promise.all(files.map(async (file, index) => {
            filesData.push(await this.uploadFile(file, pageId, index));
        }))
        return filesData;
    }

    async processSendMessage({ message, domain }) {
        let { pageId, files = [], uid, threadKey, fileUrls, uploadedFiles } = message;
        return new Promise(async (resolve, reject) => {
            try {
                if (fileUrls && fileUrls.length > 0) {
                    for (const url of fileUrls) {
                        files.push(await this.getFile(url));
                    }
                }
                // if (this.lastLoadAt && !this.hasPage(pageId)) {
                //     return reject("Can't has permission on this page");
                // }
                await this.preLoadHTML(pageId);
                if (!uid) {
                    try {
                        uid = await this.processGetUid({
                            pageId, threadKey, domain
                        });
                    } catch (e) {
                        reject(e);
                        return;
                    }
                }
                if (!uid) {
                    reject("Can't load UID");
                    return;
                }

                let formParams = this.buildParam();

                const threadId = generateOfflineThreadingID();

                formParams = {
                    ...formParams,
                    request_user_id: pageId,
                    body: message.message || "",
                    source: "source:page_unified_inbox",
                    timestamp: new Date().getTime(),
                    ephemeral_ttl_mode: 0,
                    action_type: "ma-type:user-generated-message",
                    client: "mercury",
                    other_user_fbid: uid,
                    message_id: threadId,
                    offline_threading_id: threadId,
                    has_attachment: files && files.length > 0,
                };
                formParams["specific_to_list[1]"] = `fbid:${pageId}`;
                formParams["specific_to_list[0]"] = `fbid:${uid}`;
                const formData = new FormData();
                const fileObjects = {};

                if (files && files.length > 0) {
                    const filesData = await this.uploadFiles(files, pageId);
                    filesData.forEach((current) => {
                        let type = "file";
                        if (current.type.includes("gif")) {
                            type = "gif"
                        } else if (current.type.includes("video")) {
                            type = "video"
                        } else if (current.type.includes("image")) {
                            type = "image"
                        }

                        if (!fileObjects[type]) {
                            fileObjects[type] = []
                        }
                        fileObjects[type].push(current.id)
                    });
                }

                if (uploadedFiles && uploadedFiles.length > 0) {
                    uploadedFiles?.forEach(item => {
                        if (!fileObjects[item.type]) {
                            fileObjects[item.type] = []
                        }
                        fileObjects[item.type].push(item.attachmentId);
                    })
                }

                console.log(fileObjects)

                Object.entries(fileObjects).forEach(([key, value]) => {
                    value?.forEach((item, index) => {
                        formData.append(`${key}_ids[${index}]`, item);
                    })
                })

                Object.entries(formParams).forEach(([k, v]) => {
                    formData.append(k, v);
                });

                console.log(formParams)

                const resp = await fetch("https://business.facebook.com/messaging/send", {
                    method: "POST",
                    body: formData,
                    dataType: "text",
                    mode: "cors",
                    headers: this.MercuryServerRequestsConfig
                        ? {
                            "X-MSGR-Region": this.MercuryServerRequestsConfig.msgrRegion,
                        }
                        : {},
                });
                if (resp.ok) {

                    const respData = await resp.text();

                    if (respData.includes("errorDescription")) {
                        const respText = makeParsable(respData);
                        const respJson = JSON.parse(respText);
                        if (respJson.error == errors.PLEASE_CLOSE_BROWSER) {
                            try {
                                await this.preLoadHTML(pageId, true);
                                const callbackData = await this.processSendMessage({ message, domain })
                                resolve(callbackData);
                                return;
                            } catch (e) {
                                reject(e);
                                return;
                            }
                        } else {
                            reject(`#${respJson.error} ${respJson.errorDescription}`);
                            return;
                        }
                    }
                    return resolve({
                        uid,
                        ...respData,
                    });
                } else {
                    return reject("Sorry, something went wrong");
                }

            } catch (e) {
                console.group("Can't send message")
                console.log(e);
                console.groupEnd();
                return reject(e)
            }
        });
    }

    async processGetUid(params) {
        const { pageId, threadKey } = params;
        return new Promise(async (resolve, reject) => {
            // if (this.lastLoadAt && !this.hasPage(pageId)) {
            //     return reject("Can't has permission on this page");
            // }
            if (!threadKey) {
                reject("ThreadKey is missing");
                return;
            }
            await this.preLoadHTML(pageId);

            const docId = this.docIds["MessengerThreadsQuery"];

            if (!docId) {
                reject("Can't load Doc Id");
                return;
            }
            webSession.setServerNonce(this.serverNonce.ServerNonce);

            try {
                const formParams = {
                    ...this.buildParam(),
                    "batch_name": "MessengerGraphQLThreadFetcher",
                    "av": pageId,
                    "__s": webSession.getId(),
                    "queries": this.getQueries([
                        {
                            doc_id: docId,
                            query_params: {
                                id: threadKey,
                                message_limit: 1,
                                load_messages: false,
                                load_read_receipts: true,
                                load_delivery_receipts: true,
                                is_work_teamwork_not_putting_muted_in_unreads: false,
                                threadlistViewFieldsOnly: false,
                                source: "mercury",
                            },
                        },
                    ])
                };
                const formData = new FormData();
                Object.entries(formParams).map(([k, v]) => {
                    formData.append(k, v);
                });

                const resp = await fetch("https://business.facebook.com/api/graphqlbatch/", {
                    "body": formData,
                    "method": "POST",
                    "mode": "cors",
                    "dataType": "text",
                });

                const data = await resp.text();
                if (data.includes("errorDescription")) {
                    const respText = makeParsable(data);
                    const respJson = JSON.parse(respText)
                    if (respJson.error == errors.PLEASE_CLOSE_BROWSER) {
                        await this.preLoadHTML(pageId, true);
                        const uid = await this.processGetUid(params);
                        resolve(uid);
                        return;
                    } else {
                        reject(`#${respJson.error} ${respJson.errorDescription}`);
                        return;
                    }
                }

                const lines = data.split(/\n/);
                const result = JSON.parse(lines[0]);
                const uid = result.__q0__.data.message_thread.thread_key.other_user_id;
                resolve(uid);
            } catch (e) {
                console.group("Can't get uid")
                console.log(params)
                console.log(e);
                console.groupEnd();
                reject(e)
            }
        });
    }

    async setDocId() {
        const { resouces, loadResource } = this;

        try {
            const docIdsPromise = new Promise(async function (resolve, reject) {
                let lstDocIds = {};
                try {
                    for (let [key, resourceLink] of resouces) {
                        const docIdsFromResources = await loadResource(resourceLink.src, Object.keys(moduleMapping))
                        lstDocIds = {
                            ...lstDocIds,
                            ...docIdsFromResources
                        }
                    }
                    resolve(lstDocIds);
                } catch (err) {
                    console.error("Error on load doc ids", err);
                }
                reject("Can't find any modules")
            });

            const docIds = await docIdsPromise;

            this.docIds = {
                ...this.docIds,
                ...docIds,
            }

        } catch (e) {
            console.group("Can't get doc id")
            console.log(e);
            console.groupEnd();
            reject(e)
        }
    }

    async loadResource(url, docNames) {
        const response = await fetch(url);
        const txt = await response.text();
        const docIds = {};

        const docNamesStr = docNames.join("|")

        let matchDocIds = [...txt.matchAll(new RegExp(
            'operationKind:"(?:[^"]+)",name:"(?<name>' + docNamesStr + ')",id:"(?<id>\\d+)"',
            "g"
        ))]
        matchDocIds = [
            ...matchDocIds,
            ...txt.matchAll(new RegExp(
                new RegExp(
                    'id:"(?<id>\\d+)",(?:[^:]+:.+,)?name:"(?<name>' + docNamesStr + ')"',
                    "g"
                ),
                "g"
            ))];
        if (matchDocIds.length == 0) {
            matchDocIds = [
                ...matchDocIds,
                ...txt.matchAll(new RegExp(
                    '__d\\("(?<name>' + docNamesStr + ')".+__getDocID=function\\(\\){return"(?<id>\\d+)"', "g"
                ))]
        }
        if (matchDocIds.length == 0) {
            matchDocIds = [
                ...matchDocIds,
                ...txt.matchAll(new RegExp(
                    '__d\\("(?<name>' + docNamesStr + ')_facebookRelayOperation".+?exports="(?<id>\\d+)"', "g"
                ))]
        }

        if (matchDocIds.length > 0) {
            for (var docId of matchDocIds) {
                docIds[docId.groups.name] = docId.groups.id;
            }
        }
        return docIds;
    }

    loadDocIdFromHtml(html) {
        const docNamesStr = ["FBPaymentsInvoiceCreationMutation"].join("|");
        console.log(docNamesStr, new RegExp(
            `__d\\("(?<name>${docNamesStr})_facebookRelayOperation".+?exports="(?<id>\\d+)"`, "g"
        ))
        const docids = html.matchAll(new RegExp(
            `__d\\("(?<name>${docNamesStr})_facebookRelayOperation".+?exports="(?<id>\\d+)"`, "g"
        ))
        console.log(docids.group);
    }

    setEnv(html) {
        const match = html.match(
            /(?!function)(?:envFlush)(?:\()({.*})(?=\);(?=(<|_)))/
        );
        try {
            this.Env = JSON.parse(match[1]);
        } catch (r) { }
    }

    setCtx(html) {
        let match = html.match(/"DTSGInitialData",\[\],{"token":"([^"]+)"/i) ?? html.match(/name="fb_dtsg" value="([^"]+)"/);
        if (match) {
            this.ctx.dstg = match[1];
        }

        match = html.match(
            /"DTSGInitData",\[\],{"token":"([^"]+)","async_get_token":"([^"]+)"}/
        );
        if (match) {
            this.ctx.dstg = match[1];
            this.ctx.dtsg_async = match[2];
        }

        match = html.match(
            /\["SprinkleConfig",\[\],{"param_name":"([^"]+)","version":(\d+),"should_randomize":(true|false)}/
        )

        if (match) {
            this.sprinkle_config = {
                param_name: match[1],
                version: match[2],
                should_randomize: "true" == match[3],
            }
        }

        match = html.match(/\["SiteData",\[\],([^\]]+),\d+\]/);
        if (match) {
            this.siteData = JSON.parse(match[1]);
        }

        match = html.match(/\["ServerNonce",\[\],([^\]]+),\d+\]/);
        if (match) {
            this.serverNonce = JSON.parse(match[1]);
        }
        match = html.match(/\["WebConnectionClassServerGuess",\[\],([^\]]+),\d+\]/);
        if (match) {
            this.webConnectionClassServerGuess = JSON.parse(match[1]);
        }

        match = html.match(/\["MercuryServerRequestsConfig",\[\],([^\]]+),\d+\]/);
        if (match) {
            this.mercuryServerRequestsConfig = JSON.parse(match[1]);
        }
    }


    async setResource(html) {
        const moduleNeedLoadSyntax = Object.values(moduleMapping);
        let moduleNeedLoads = [];

        moduleNeedLoadSyntax.map(module => {
            const matchedModules = GetModule(html, module);
            if (matchedModules.length > 0) {
                moduleNeedLoads = [
                    ...moduleNeedLoads,
                    ...JSON.parse(matchedModules[0]).r
                ]
            }
        });

        const resourceMaps = GetModule(html, '"rsrcMap":');
        const resLists = await Promise.all(resourceMaps.map(res => {
            return JSON.parse(res)
        }));

        let lists = resLists.reduce((pre, cur) => {
            Object.entries(cur).map(([key, value]) => {
                if (moduleNeedLoads.includes(key) && value.type == "js" && !!value.src) {
                    pre[key] = value;
                }
            });
            return pre;
        }, {});

        const bootLoades = [...html.matchAll(/script src="([^"]+)" data-bootloader-hash="([^"]+)"/g)];
        bootLoades.map(x => {
            const [file, link, hash] = x;
            if (moduleNeedLoads.includes(hash)) {
                lists[hash] = {
                    src: link,
                    type: "js"
                };
            }
        })

        this.resouces = new Map(Object.entries(lists));
    }

    setUserId(html) {
        if (!this.ctx.userId) {
            const match = html.match(/\\?"USER_ID\\?":\\?"(\d+)\\?"/i);
            if (match) this.ctx.userId = match[1];
        }
    }

    setPages(html) {
        this.pages = [];
        let global_scopes = GetModule(html, 'global_scopes:');
        if (global_scopes.length > 0) {
            const globalScopes = new Function("return (" + global_scopes[0] + ")")();
            if (globalScopes?.nodes) {
                globalScopes.nodes.map((cur) => {
                    cur.asset_lists.map(item => {
                        item.objects.nodes.map(page => {
                            this.pages.push({
                                id: page.asset_id,
                                name: page.name,
                            })
                        })
                    })
                })
            }
        }
        let business_scoping = GetModule(html, 'business_scoping:');
        if (business_scoping.length > 0) {
            const businessScopes = new Function("return (" + business_scoping[0] + ")")();
            if (businessScopes?.selectedScope?.nodes.length > 0) {
                businessScopes.selectedScope.nodes.map((cur) => {
                    cur.asset_lists.map(item => {
                        item.objects.nodes.map(page => {
                            if (!this.pages.find(x => x.id == page.ent.id)) {
                                this.pages.push({
                                    id: page.ent.id,
                                    name: page.ent.name,
                                })
                            }
                        })
                    })
                })
            }
        }
    }
}

export default (new FacebookSdk());

const moduleMapping = {
    // "MessengerThreadlistQuery": "MessengerGraphQLThreadlistFetcher\.bs", //quét list uid
    "MessengerThreadsQuery": "MessengerGraphQLThreadFetcher\.bs", // lấy uid của 1 hội thoại
    // "FBPaymentsInvoiceCreationMutation": "FBPaymentsModulesAPI" // tạo đơn hàng
}
