"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("superagent"));
class http_manager {
    constructor(base_url, key = "") {
        this.base_url = base_url;
        this.key = key;
    }
    get(path, headers = {}) {
        const request = http.get(`${this.base_url}/${path}/`);
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
        const request = http.post(`${this.base_url}/${path}/`);
        for (const [header, value] of Object.entries(headers)) {
            request.set(header, value);
        }
        request.send(fields);
        return new Promise(resolve => {
            request.end((_, res) => {
                resolve(res);
            });
        });
    }
    delete(path, fields = {}, headers = {}) {
        const request = http.delete(`${this.base_url}/${path}/`);
        for (const [header, value] of Object.entries(headers)) {
            request.set(header, value);
        }
        request.send(fields);
        return new Promise(resolve => {
            request.end((_, res) => {
                resolve(res);
            });
        });
    }
}
exports.default = http_manager;
