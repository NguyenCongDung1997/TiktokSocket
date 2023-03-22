import FacebookSdk from "../../facebook";
import workerMessage from "../../core/message";
import NobiMess from '../../facebook/mess';
import Tiktok from '../../tiktok';
// import '../../tiktok/webmssdk';

let nobiMess = new NobiMess(FacebookSdk);

//  FacebookSdk.preLoadHTML()
class Ecrm {
  constructor() {
    this.domains = [];
    // if (!localStorage.getItem("browserId")) localStorage.setItem("browserId", uuidv4());
  }

   initWorker() {
    chrome.runtime.onMessage.addListener(
      async (response, sender, sendResponse) => {
        console.log(response)
        if (!response?.type?.includes("NOBI_")) return;

        const { domain } = response;
        console.log(domain)
        switch (response.type.replace("NOBI_", "")) {
          case "SET_TOKEN":
            const { accessToken } = response;
            if (!accessToken) return;
            let tokenStorage = await localStorage.getItem("tokens");
            let tokens = {};
            if (tokenStorage) {
              tokens = JSON.parse(tokenStorage);
            }
            tokens[domain] = accessToken;
            localStorage.setItem("tokens", JSON.stringify(tokens));
            break;
          case "GET_UID":
            await FacebookSdk.getUid({
              ...response.params,
              domain
            });
            break;
          case "SEND_FB_MESSAGE":
            await FacebookSdk.sendMessage(response);
            break;
          case "PRELOAD_DOC_IDS":
            const { pageId } = response
            await FacebookSdk.preLoadHTML(pageId);
            break;
          case "UPDATE_MESS_CAMPAIGN":
            nobiMess.update(domain, response.campaign);
            break;
          case "GET_MESS_CAMPAIGN":
            workerMessage.send("MESS_CAMPAIGN_LIST", {
              campaigns: nobiMess.campaigns[domain],
              domain
            });
            break;
          case "REMOVE_MESS_CAMPAIGN":
            nobiMess.remove(response.id, domain);
            break;
          default:
            break;
        }
      }
    );
  }
}



chrome.runtime.onInstalled.addListener((e) => {
  overightHeaders();
});

chrome.runtime.onStartup.addListener(() => {
  overightHeaders();
});

chrome.tabs.onUpdated.addListener(function (e, t, r) {
  if (
    "complete" == t.status &&
    /(http(s)?):\/\/((.*\.)?ecrm.vn|nobi.pro|nobi.ph|localhost)?.+/.test(r.url)
  ) {
    onActiveExt();
  }
});


function onActiveExt() {
  workerMessage.send("INIT", {
    version: "2.1.8"
  });
}

function overightHeaders() {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (e) => {
      if (-1 === e.tabId) {
        var authUrl = false;
        e.requestHeaders.forEach((header) => {
          if (
            (("Authority" != header.name && "authority" != header.name),
              "Sec-Fetch-Site" == header.name && (header.value = "same-origin"),
              "Origin" === header.name)
          ) {
            var a = document.createElement("a");
            switch (((a.href = e.url), a.hostname)) {
              case "www.facebook.com":
              case "facebook.com":
              case "upload.facebook.com":
                "https://www.facebook.com/api/graphql/" == e.url &&
                  (t = "www.facebook.com"),
                  (header.value = "https://www.facebook.com");
                break;
              case "business.facebook.com":
              case "graph.facebook.com":
                header.value = "https://business.facebook.com";
                break;
              case "upload-business.facebook.com":
                header.value = "https://upload-business.facebook.com";
                break;
              case "imapi-va-oth.isnssdk.com":
              case "seller-vn.tiktok.com":
                header.value = "https://seller-vn.tiktok.com";
                break;
              default:
                header.value = "https://m.facebook.com";
            }
          }
        }),
          authUrl && e.requestHeaders.push({ name: "Authority", value: authUrl });
      }
      return { requestHeaders: e.requestHeaders };
    },
    REQUEST_FILTER,
    EXTRA_INFO_SPEC
  );
}

const EXTRA_INFO_SPEC = ["blocking", "requestHeaders"];
const BROWSER_VERSION = (/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [
  0,
])[1];
if (BROWSER_VERSION >= 72) {
  EXTRA_INFO_SPEC.push("extraHeaders");
}

const REQUEST_FILTER = {
  urls: [
    "*://m.facebook.com/*",
    "*://p-upload.facebook.com/*",
    "*://business.facebook.com/*",
    "*://upload-business.facebook.com/*",
    "*://upload.facebook.com/*",
    "*://www.facebook.com/*",
    "*://mbasic.facebook.com/*",
    "*://*.ecrm.vn/*",
    "*://*.nobi.pro/*",
    "*://*.nobi.ph/*",
    "*://*.seller-vn.tiktok.com/*",
    "*://*.imapi-va-oth.isnssdk.com/*",
  ],
  types: ["xmlhttprequest"],
};


const ecrm = new Ecrm();
ecrm.initWorker();
Tiktok.run();