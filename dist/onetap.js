"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const string_similarity_1 = __importDefault(require("string-similarity"));
const logger_1 = __importDefault(require("./helpers/logger"));
const http_1 = __importDefault(require("./helpers/http"));
const http = new http_1.default('api.onetap.com/cloud/');
class onetap {
    constructor(api_key, tick_delay = 2500) {
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Api-Key': ''
        };
        this.emitter = new events_1.EventEmitter();
        this.old_data = {
            scripts: {
                invites: "",
                subs: ""
            },
            configs: {
                invites: "",
                subs: ""
            }
        };
        this.headers["X-Api-Key"] = api_key;
        setInterval(() => { this.tick(); }, tick_delay);
    }
    static handle_errors(response) {
        var _a;
        if (response.body.errors == undefined)
            return true;
        logger_1.default.err(((_a = response.body.errors) === null || _a === void 0 ? void 0 : _a.at(0).message) ||
            'An unexpected error occured.');
        return false;
    }
    get_key() {
        return this.headers["X-Api-Key"];
    }
    set_key(new_key) {
        this.headers["X-Api-Key"] = new_key;
    }
    get_configs() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('configs', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(body.configs || []);
            });
        });
    }
    get_config_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = yield this.get_configs();
            const best_match = string_similarity_1.default.findBestMatch(name, configs.map(cfg => cfg.name)).bestMatch.target;
            logger_1.default.assert(best_match == name, `There's no configuration called "${name}", using "${best_match}" instead.`);
            return new Promise((resolve) => {
                resolve(configs === null || configs === void 0 ? void 0 : configs.find(cfg => { return cfg.name == best_match; }));
            });
        });
    }
    get_config_id(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            return new Promise((resolve) => {
                resolve(config.config_id || 0);
            });
        });
    }
    get_config_name(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get(`configs/${id}`, this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                var _a;
                resolve(((_a = body.config) === null || _a === void 0 ? void 0 : _a.name) || "");
            });
        });
    }
    get_scripts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('scripts', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise(resolve => {
                resolve(body.scripts || []);
            });
        });
    }
    get_script_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const scripts = yield this.get_scripts();
            const best_match = string_similarity_1.default.findBestMatch(name, scripts.map(script => script.name)).bestMatch.target;
            logger_1.default.assert(best_match == name, `There's no script called "${name}", using "${best_match}" instead.`);
            return new Promise((resolve) => {
                resolve(scripts === null || scripts === void 0 ? void 0 : scripts.find(cfg => { return cfg.name == best_match; }));
            });
        });
    }
    get_script_id(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            return new Promise((resolve) => {
                resolve(script.script_id || 0);
            });
        });
    }
    get_script_name(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get(`scripts/${id}`, this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                var _a;
                resolve(((_a = body.script) === null || _a === void 0 ? void 0 : _a.name) || "");
            });
        });
    }
    get_config_invites() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('configs/invites', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise(resolve => {
                resolve(body.invites || []);
            });
        });
    }
    get_config_invite_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const invites = yield this.get_config_invites();
            return new Promise((resolve) => {
                resolve(invites === null || invites === void 0 ? void 0 : invites.filter(inv => { return inv.config_id === config.config_id; }));
            });
        });
    }
    create_config_invite(name, max_age = 0, max_uses = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const response = yield http.post(`configs/${config.config_id}/invites`, {
                'max_age': max_age.toString(),
                'max_uses': max_uses.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.invite || []);
            });
        });
    }
    delete_config_invite(name, invite_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const response = yield http.delete(`configs/${config.config_id}/invites`, {
                'invite_id': invite_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.success || false);
            });
        });
    }
    get_script_invites() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('scripts/invites', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(body.invites || []);
            });
        });
    }
    get_script_invite_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const invites = yield this.get_script_invites();
            return new Promise((resolve) => {
                resolve(invites === null || invites === void 0 ? void 0 : invites.filter(inv => { return inv.script_id === script.script_id; }));
            });
        });
    }
    create_script_invite(name, max_age = 0, max_uses = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const response = yield http.post(`scripts/${script.script_id}/invites`, {
                'max_age': max_age.toString(),
                'max_uses': max_uses.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.invite || []);
            });
        });
    }
    delete_script_invite(name, invite_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const response = yield http.delete(`scripts/${script.script_id}/invites`, {
                'invite_id': invite_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.success || false);
            });
        });
    }
    get_config_subscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('configs/subscriptions', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(body.subscriptions || []);
            });
        });
    }
    get_config_subscription_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const response = yield http.get(`configs/${config.config_id}/subscriptions`, this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(body.subscriptions || []);
            });
        });
    }
    add_config_subscription(name, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const response = yield http.post(`configs/${config.config_id}/subscriptions`, {
                'user_id': user_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.subscription || []);
            });
        });
    }
    remove_config_subscription(name, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.get_config_by_name(name);
            const response = yield http.delete(`configs/${config.config_id}/subscriptions`, {
                'user_id': user_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body || []);
            });
        });
    }
    get_script_subscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield http.get('scripts/subscriptions', this.headers);
            const body = response.body;
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(body.subscriptions || []);
            });
        });
    }
    get_script_subscription_by_name(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const response = yield http.get(`scripts/${script.script_id}/subscriptions`, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.subscriptions || []);
            });
        });
    }
    add_script_subscription(name, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const response = yield http.post(`scripts/${script.script_id}/subscriptions`, {
                'user_id': user_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.subscription || []);
            });
        });
    }
    remove_script_subscription(name, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const script = yield this.get_script_by_name(name);
            const response = yield http.delete(`scripts/${script.script_id}/subscriptions`, {
                'user_id': user_id.toString()
            }, this.headers);
            onetap.handle_errors(response);
            return new Promise((resolve) => {
                resolve(response.body.success || false);
            });
        });
    }
    on(event, func) {
        this.emitter.on(event, func);
    }
    tick() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emitter.emit('tick');
            if (this.emitter.listenerCount('config-subscription')) {
                const subs = yield this.get_config_subscriptions();
                const data = JSON.stringify(subs);
                if (this.old_data.configs.subs && this.old_data.configs.subs !== data) {
                    this.emitter.emit('config-subscription');
                }
                this.old_data.configs.subs = data;
            }
        });
    }
}
exports.default = onetap;
