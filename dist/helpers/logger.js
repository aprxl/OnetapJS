"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class logger {
    constructor(prefix = "Logger") {
        this.prefix = prefix;
    }
    clear() {
        console.clear();
        return this;
    }
    log(msg) {
        console.log(chalk_1.default.white(this.prefix), chalk_1.default.gray(msg));
        return this;
    }
    warn(msg) {
        console.log(chalk_1.default.yellowBright(this.prefix), chalk_1.default.gray(msg));
        return this;
    }
    err(msg) {
        console.log(chalk_1.default.redBright(this.prefix), chalk_1.default.gray(msg));
        return this;
    }
    assert(condition, msg) {
        if (!condition)
            this.warn(msg);
        return this;
    }
}
exports.default = new logger('Onetap');
