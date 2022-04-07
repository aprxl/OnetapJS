import chalk from 'chalk';

class logger {
  constructor (private prefix = "Logger") {}

  public clear(): logger {
    console.clear();
    return this;
  }

  public log(msg: string): logger {
    console.log(chalk.white(this.prefix), chalk.gray(msg));
    return this;
  }

  public warn(msg: string): logger {
    console.log(chalk.yellowBright(this.prefix), chalk.gray(msg));
    return this;
  }

  public err(msg: string): logger {
    console.log(chalk.redBright(this.prefix), chalk.gray(msg));
    return this;
  }

  public assert(condition: boolean, msg: string) {
    if (!condition)
      this.warn(msg);

    return this;
  }
}

export default new logger('Onetap');