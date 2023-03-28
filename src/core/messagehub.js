import Tiktok from '../../src/tiktok';
import * as signalR from '@microsoft/signalr';

class HubConnection {
    constructor(data) {
        this.data = data
    }
    run() {

        const { domain, accessToken } = this.data;
        const messagehub = new signalR.HubConnectionBuilder()
            .withUrl(`https://${domain}/messagehub`, {
                accessTokenFactory: () => {
                    return accessToken;
                },
            })
            .withAutomaticReconnect([0, 100, 200, 500, 800, 1000, 2000, 3000, null])
            .configureLogging(signalR.LogLevel.Information)
            .build();
        messagehub.onclose(() => {
            console.log('message hub closed, reconnecting...')
            this.connect(messagehub);
        })
            
        messagehub.on('connected', data => {
            window.signalRConnectionId = data.connectionId;
            console.log('singleR: connected', data)
        })
        messagehub.on('pong', data => {
            console.log('singleR: pong', data)
        })
        messagehub.on('message', data => {
            console.log('message', data)
            if (data.type == "HOOK_ORDER_TIKTOK") {
                Tiktok.sendMessage(data.data)
            }
        })

        messagehub.onreconnected(data => {
            messagehub.invoke("Join", location.host);
            console.log("onreconnected");
        })

        window.ping = (message) => {
            messagehub.invoke("Ping", message, location.host)
        }

        this.connect(messagehub, domain);
        return messagehub;
    }
    connect(messagehub, domain) {
        if (messagehub != undefined) {
            messagehub.start()
                .then(() => {
                    messagehub.invoke("Join", `${location.host}`);
                    console.log(messagehub);
                })
                .catch(e => {
                    console.log('connect error, reconnecting..')
                    setTimeout(this.connect, 3000);
                })
        }
    }
    disconnect(messagehub) {
        messagehub.stop();
    }

}

export default HubConnection;