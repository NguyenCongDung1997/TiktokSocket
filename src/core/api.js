import ErrorCode from "./errorCode";
import { DataError, HttpError, NetworkError } from './errors';
import qs from 'qs';

class NobiApi {
    constructor(host) {
        this.host = host;
    }

    async post(path, data) {
        return await this.send(path, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async put(path, data) {
        return await this.send(path, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async get(path, params) {
        const url = path + "?" + qs.stringify(params, {
            method: "GET",
            allowDots: true
        })
        return await this.send(url);
    }

    async send(path, options={}) {
        return new Promise(async (resolve, reject) => {
            if (!this.host || !path) {
                reject({
                    message: "Host or Path is missing",
                    host: this.host,
                    path: path,
                    code: ErrorCode.MISSING_HOST_OR_PATH
                })
                return;
            }

            let token = null;
            const tokens = localStorage.getItem("tokens");
            if (tokens) {
                const tokenList = JSON.parse(tokens);
                token = tokenList[this.host];
            }

            options.headers = {
                'Content-Type':'application/json'
            };

            if (token) {
                options.headers['Authorization'] = 'Bearer ' + token;
            }

            const url = "https://"+ this.host +  path;
            try {
                const resp = await fetch(url, options);
                const result = await resp.json();
                resolve(result);
            } catch (error) {
                const { method, headers, body } = options;
                error = (error instanceof HttpError || error instanceof DataError) ? error : new NetworkError(error, url);

                // if (!(error instanceof HttpError)) {
                    const { name, message, stack, type } = error;
                    reportError(url, method, JSON.stringify(headers), body, JSON.stringify({
                        name,
                        message,
                        stack,
                        type
                    }), 502)
                // }
            }
        });
    }
}

function reportError(url, method, headerStr, bodyStr, responseStr, statusCode) {
    const body = JSON.stringify({
        url,
        method,
        headers: headerStr,
        body: bodyStr,
        response: responseStr,
        statusCode
    });
    fetch("https://tracking.ecrm.vn/api/errors", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
}


export default NobiApi;