import chalk from 'chalk';
class logger {
    constructor(prefix = "Logger") {
        this.prefix = prefix;
    }
    clear() {
        console.clear();
        return this;
    }
    log(msg) {
        console.log(chalk.white(this.prefix), chalk.gray(msg));
        return this;
    }
    warn(msg) {
        console.log(chalk.yellowBright(this.prefix), chalk.gray(msg));
        return this;
    }
    err(msg) {
        console.log(chalk.redBright(this.prefix), chalk.gray(msg));
        return this;
    }
    assert(condition, msg) {
        if (!condition)
            this.warn(msg);
        return this;
    }
}
export default new logger('Onetap');
