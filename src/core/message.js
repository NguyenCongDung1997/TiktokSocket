const acceptUrl = [
    "localhost",
    ".nobi.pro",
    ".nobi.ph",
    ".ecrm.vn",
]

class WorkerMessage {
    send(type, data = {}) {
        chrome.tabs.query({}, function (tabs) {
            tabs.filter(x => x.url && acceptUrl.filter(a => x.url.includes(a)).length > 0).forEach((tab) => {
                chrome.tabs.sendMessage(
                    tab.id,
                    {
                        type: "NOBI_" + type,
                        ...data
                    },
                );
            });
        });
    }
}

const workerMessage = new WorkerMessage();
export default workerMessage;

