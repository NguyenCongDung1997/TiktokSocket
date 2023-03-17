import AutoQueue from "../libs/queue";
import NobiApi from "../core/api";
import workerMessage from '../core/message';
import { isBetween } from '../libs/utils';
import { errors } from './const';

class NobiMess {
    constructor(sdk) {
        this.sdk = sdk;
        this.campaigns = {};
        this.pendingCampaigns = {};
        this.queue = {};
    }

    async update(domain, campaign) {
        if (!this.campaigns.hasOwnProperty(domain)) {
            this.campaigns[domain] = new Map();
        }

        if (this.has(campaign.id, domain)) {
            this.set(campaign, domain);
            if (campaign.status == FbCampaignStatus.Pause) {
                this.pause(campaign, domain);
            } else {
                const queueKey = [domain, campaign.id].join("_");
                if (this.pendingCampaigns[queueKey]) {
                    this.start(campaign, domain);
                } else {
                    this.createQueue(campaign, domain);
                }
            }
        } else if ([FbCampaignStatus.Active, FbCampaignStatus.Pending, FbCampaignStatus.Sending].includes(campaign.status)) {
            this.set(campaign, domain);
            this.createQueue(campaign, domain);
        }
    }

    get(id, domain) {
        return this.campaigns[domain].get(id);
    }
    has(id, domain) {
        return this.campaigns[domain].has(id)
    }
    set(campaign, domain) {
        this.campaigns[domain].set(campaign.id, campaign);
    }
    remove(id, domain) {
        this.campaigns[domain].delete(id);
        const queueKey = [domain, id].join("_");
        if (this.queue[queueKey]) {
            this.queue[queueKey].stop();
        }
        if (this.pendingCampaigns[queueKey]) {
            clearTimeout(this.pendingCampaigns[queueKey])
        }

        workerMessage.send("REMOVE_MESS_CAMPAIGN_SUCCESS", {
            id,
            domain,
        });
    }

    pause(campaign, domain) {
        if (!this.has(campaign.id, domain)) {
            console.error("Campaign is not exist", campaign, domain);
            return;
        }
        const queueKey = [domain, campaign.id].join("_");

        if (this.pendingCampaigns[queueKey]) {
            clearTimeout(this.pendingCampaigns[queueKey]);
            delete this.pendingCampaigns[queueKey];
        };


        campaign.status = FbCampaignStatus.Pause
        if (this.queue[queueKey]) {
            //dùng stop để clear luôn hàng đợi
            this.queue[queueKey].stop();
        }

        workerMessage.send("UPDATE_MESS_CAMPAIGN_SUCCESS", {
            campaign,
            domain,
        });

        this.set(campaign, domain);
    }

    createQueue(campaign, domain) {

        workerMessage.send("UPDATE_MESS_CAMPAIGN_SUCCESS", {
            campaign,
            domain,
        });
        const { sendDate, attachmentUrls } = campaign;
        const pendingKey = [domain, campaign.id].join("_");

        if (this.pendingCampaigns[pendingKey]) clearTimeout(this.pendingCampaigns[pendingKey]);

        const diffMiliseconds = (new Date(sendDate).getTime() - new Date().getTime());
        this.pendingCampaigns[pendingKey] = setTimeout(async () => {
            if (attachmentUrls) {
                campaign.files = await Promise.all(attachmentUrls.map(x => this.sdk.getFile(x)));
                this.set(campaign, domain);
            }
            this.queue[pendingKey] = new AutoQueue({
                delay: 6,
            });
            this.start(campaign, domain);
        }, diffMiliseconds);
    }

    async start(campaign, domain) {
        const { id } = campaign;
        if (!isBetween(campaign.timeStart, campaign.timeEnd)) {
            await new NobiApi(domain).put(`/api/extension/${id}/status`, {
                status: FbCampaignStatus.Pause
            });
            this.pause(campaign, domain);
            return;
        };

        if (this.isLimit(campaign, domain)) {
            await this.stop();
            return;
        };

        if (!this.has(id, domain)) {
            console.error("Campaign is not exist", campaign, domain);
            return;
        }
        const queueKey = [domain, id].join("_");
        this.queue[queueKey].start();

        try {

            await new NobiApi(domain).put(`/api/extension/${id}/status`, {
                status: FbCampaignStatus.Sending
            });

            campaign.status = FbCampaignStatus.Sending

            workerMessage.send("UPDATE_MESS_CAMPAIGN_SUCCESS", {
                campaign,
                domain,
            });

            this.set(campaign, domain);

            await this.send(campaign.id, domain);

        } catch (e) {
            console.group("Can't start campaign");
            console.log(e)
            console.groupEnd();
        }
    }

    async send(campaignId, domain) {
        const queueKey = [domain, campaignId].join("_");
        if (!this.queue[queueKey] || !this.has(campaignId, domain)) return;
        const campaign = this.get(campaignId, domain);

        const pagesize = 25;
        const { id, files, fbPageId: pageId } = campaign;
        const api = new NobiApi(domain);
        try {
            const res = await api.get(`/api/extension/${id}/messages`, {
                pagesize
            });
            const { items, code } = res;
            //limit hoặc đã gửi hết
            if (code == 1 || (code == 200 && items.length == 0)) {
                this.stop(campaign, domain);
                return;
            }

            //quá thời gian gửi
            if (code == 2) {
                await api.put(`/api/extension/${campaign.id}/status`, {
                    status: FbCampaignStatus.Pause
                });
                this.pause(campaign, domain);
                return;
            }

            for (const item of items) {
                this.queue[queueKey].enqueue(() => this.processSend({
                    message: item,
                    files,
                    domain,
                    campaignId: id,
                    pageId
                }));
            }
        } catch (e) {
            await api.put(`/api/extension/${campaign.id}/status`, {
                status: FbCampaignStatus.Pause
            });
            this.pause(campaign, domain);
        }

    }

    isLimit(campaign) {
        return (campaign.limitMessage > 0 && campaign.totalSent >= campaign.limitMessage)
    }


    async stop(campaign, domain) {
        const queueKey = [domain, campaign.id].join("_");
        campaign.status = FbCampaignStatus.Completed;
        this.set(campaign, domain);
        await new NobiApi(domain).put(`/api/extension/${campaign.id}/status`, {
            status: FbCampaignStatus.Completed
        });
        this.queue[queueKey].stop();
        workerMessage.send("UPDATE_MESS_CAMPAIGN_SUCCESS", {
            campaign,
            domain,
        })
    }

    async processSend(item) {
        const { message, files, domain, campaignId, timeStart, timeEnd } = item;
        if (!this.has(campaignId, domain)) return;

        const campaign = this.get(campaignId, domain);
        const api = new NobiApi(domain);
        const queueKey = [domain, campaign.id].join("_");
        if (!isBetween(timeStart, timeEnd)) {
            await api.put(`/api/extension/${campaign.id}/status`, {
                status: FbCampaignStatus.Pause
            });
            this.pause(campaign, domain);
            return;
        }

        if (this.isLimit(campaign, domain)) {
            await this.stop();
            return;
        };

        const { text, threadKey, name, files: uploadedFiles } = message;
        let { uid, customerId } = message;

        let messageObj = {
            campaignId,
            customerId,
            name,
            uid,
            status: FbStatus.UnSent,
            uploadedFiles
        }

        let isMissingPermission = false;

        try {

            const { id } = await api.post(`/api/extension/message`, messageObj);
            messageObj.id = id;

            const sendResp = await this.sdk.processSendMessage({
                message: {
                    pageId: campaign.fbPageId,
                    threadKey: threadKey.replace("t_", ""),
                    uid,
                    message: text,
                    files: uploadedFiles ? null : files,
                    uploadedFiles
                },
                domain
            });

            messageObj.status = FbStatus.Sent;
            campaign.totalSent++;
            if (!uid) uid = sendResp.uid;

        } catch (e) {
            if (typeof e === 'string' || e instanceof String) {
                //ko có quyền trên page thì tạm dừng luôn
                if (e.includes("#" + errors.MISSING_PERMISSION)) {
                    isMissingPermission = true;
                    await new NobiApi(domain).put(`/api/extension/${campaign.id}/status`, {
                        status: FbCampaignStatus.Pause
                    });
                    this.pause(campaign, domain);
                }
                messageObj.errorReason = e;
            } else if (e.__html) {
                messageObj.errorReason = e.__html;
            } else {
                messageObj.errorReason = e.message;
            }
            messageObj.status = FbStatus.Error;
            campaign.totalError++;
        } finally {

            workerMessage.send("SEND_MESS_DONE", {
                campaignId,
                message: messageObj,
                campaign,
                domain,
                uid
            });
            if (isMissingPermission) return;
            await api.put(`/api/extension/message/${messageObj.id}`, messageObj);
            if (this.isLimit(campaign, domain)) {
                await this.stop(campaign, domain);
                return;
            };

            if (this.queue[queueKey].isEmpty()) {
                await this.send(campaign.id, domain);
            }
        }
    }
}

export default NobiMess;

const FbCampaignStatus =
{
    Active: 1,
    Completed: 2,
    Sending: 4,
    Pause: 7,
    Cancel: 8,
    Pending: 9
}

const FbStatus =
{
    UnSent: 1,
    Sent: 2,
    Error: 3,
    Queued: 4,
    Viewed: 5
}