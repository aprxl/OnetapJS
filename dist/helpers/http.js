import spagent from "superagent";
export default class http_manager {
    constructor(base_url, key = "") {
        this.base_url = base_url;
        this.key = key;
    }
    get(path, headers = {}) {
        const request = spagent.get(`${this.base_url}/${path}/`);
        for (const [header, value] of Object.entries(headers)) {
            request.set(header, value);
        }
        return new Promise((resolve) => {
            request.end((_, res) => {
                resolve(res);
            });
        });
    }
    post(path, fields = {}, headers = {}) {
        const request = spagent.post(`${this.base_url}/${path}/`);
        for (const [header, value] of Object.entries(headers)) {
            request.set(header, value);
        }
        request.send(fields);
        return new Promise((resolve) => {
            request.end((_, res) => {
                resolve(res);
            });
        });
    }
    delete(path, fields = {}, headers = {}) {
        const request = spagent.delete(`${this.base_url}/${path}/`);
        for (const [header, value] of Object.entries(headers)) {
            request.set(header, value);
        }
        request.send(fields);
        return new Promise((resolve) => {
            request.end((_, res) => {
                resolve(res);
            });
        });
    }
}
