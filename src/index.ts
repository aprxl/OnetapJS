import logger from "./helpers/logger";
import onetap from './onetap';

import http_manager from './helpers/http';

const client = new onetap('GlfLxneF3la90FZf3ECpbdoV4F4HVe7F');

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

client.on('config-subscription', () => logger.log('New subscription detected'));

async function main() {
  logger.clear();

}

main();
