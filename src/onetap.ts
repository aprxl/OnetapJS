/// TODO
/// Event listeners

import { EventEmitter } from "events";
import ss from "string-similarity";

import logger from "./helpers/logger.js";
import http_manager from "./helpers/http.js";

import superagent from "superagent";

const http = new http_manager("api.onetap.com/cloud/");

interface config {
  readonly config_id: number;
  readonly user_id: number;
  readonly name: string;
  readonly data: string;
  readonly created: number;
  readonly updated: number;
}

interface script {
  readonly script_id: number;
  readonly user_id: number;
  readonly name: string;
  readonly created: number;
  readonly updated: number;
}

interface config_invite {
  readonly code: string;
  readonly config_id: number;
  readonly created: number;
  readonly invite_id: number;
  readonly max_age: number;
  readonly max_uses: number;
  readonly updated: number;
  readonly user_id: number;
  readonly uses: number;
}

interface script_invite {
  readonly code: string;
  readonly script_id: number;
  readonly created: number;
  readonly invite_id: number;
  readonly max_age: number;
  readonly max_uses: number;
  readonly updated: number;
  readonly user_id: number;
  readonly uses: number;
}

interface config_subscription {
  readonly config_id: number;
  readonly created: number;
  readonly status: string;
  readonly updated: number;
  readonly user_id: number;
}

interface script_subscription {
  readonly script_id: number;
  readonly created: number;
  readonly status: string;
  readonly updated: number;
  readonly user_id: number;
}

interface cache {
  [key: string]: { [key: string]: string };
}

type event = "tick" | "config-subscription";

class onetap {
  private headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Api-Key": "",
  };

  private emitter = new EventEmitter();
  private old_data: cache = {
    scripts: {
      invites: "",
      subs: "",
    },
    configs: {
      invites: "",
      subs: "",
    },
  };

  private static handle_errors(response: superagent.Response): boolean {
    if (response.body.errors == undefined) return true;

    logger.err(
      response.body.errors?.at(0).message || "An unexpected error occured."
    );

    return false;
  }

  public constructor(api_key: string, tick_delay = 2500) {
    this.headers["X-Api-Key"] = api_key;

    setInterval(() => {
      this.tick();
    }, tick_delay);
  }

  public get_key(): string {
    return this.headers["X-Api-Key"];
  }

  public set_key(new_key: string): void {
    this.headers["X-Api-Key"] = new_key;
  }

  public async get_configs(): Promise<config[]> {
    const response = await http.get("configs", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.configs || []);
    });
  }

  public async get_config_by_name(name: string): Promise<config> {
    const configs = await this.get_configs();

    const best_match = ss.findBestMatch(
      name,
      configs.map((cfg) => cfg.name)
    ).bestMatch.target;

    logger.assert(
      best_match == name,
      `There's no configuration called "${name}", using "${best_match}" instead.`
    );

    return new Promise((resolve) => {
      resolve(
        configs?.find((cfg) => {
          return cfg.name == best_match;
        })
      );
    });
  }

  public async get_config_id(name: string): Promise<number> {
    const config = await this.get_config_by_name(name);

    return new Promise((resolve) => {
      resolve(config.config_id || 0);
    });
  }

  public async get_config_name(id: number): Promise<string> {
    const response = await http.get(`configs/${id}`, this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.config?.name || "");
    });
  }

  public async get_scripts(): Promise<script[]> {
    const response = await http.get("scripts", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.scripts || []);
    });
  }

  public async get_script_by_name(name: string): Promise<script> {
    const scripts = await this.get_scripts();

    const best_match = ss.findBestMatch(
      name,
      scripts.map((script) => script.name)
    ).bestMatch.target;

    logger.assert(
      best_match == name,
      `There's no script called "${name}", using "${best_match}" instead.`
    );

    return new Promise((resolve) => {
      resolve(
        scripts?.find((cfg) => {
          return cfg.name == best_match;
        })
      );
    });
  }

  public async get_script_id(name: string): Promise<number> {
    const script = await this.get_script_by_name(name);

    return new Promise((resolve) => {
      resolve(script.script_id || 0);
    });
  }

  public async get_script_name(id: number): Promise<string> {
    const response = await http.get(`scripts/${id}`, this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.script?.name || "");
    });
  }

  public async get_config_invites(): Promise<config_invite[]> {
    const response = await http.get("configs/invites", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.invites || []);
    });
  }

  public async get_config_invite_by_name(
    name: string
  ): Promise<config_invite[]> {
    const config = await this.get_config_by_name(name);
    const invites = await this.get_config_invites();

    return new Promise((resolve) => {
      resolve(
        invites?.filter((inv) => {
          return inv.config_id === config.config_id;
        })
      );
    });
  }

  public async create_config_invite(
    name: string,
    max_age = 0,
    max_uses = 0
  ): Promise<config_invite> {
    const config = await this.get_config_by_name(name);

    const response = await http.post(
      `configs/${config.config_id}/invites`,
      {
        max_age: max_age.toString(),
        max_uses: max_uses.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.invite || []);
    });
  }

  public async delete_config_invite(
    name: string,
    invite_id: number
  ): Promise<boolean> {
    const config = await this.get_config_by_name(name);

    const response = await http.delete(
      `configs/${config.config_id}/invites`,
      {
        invite_id: invite_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.success || false);
    });
  }

  public async get_script_invites(): Promise<script_invite[]> {
    const response = await http.get("scripts/invites", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.invites || []);
    });
  }

  public async get_script_invite_by_name(
    name: string
  ): Promise<script_invite[]> {
    const script = await this.get_script_by_name(name);
    const invites = await this.get_script_invites();

    return new Promise((resolve) => {
      resolve(
        invites?.filter((inv) => {
          return inv.script_id === script.script_id;
        })
      );
    });
  }

  public async create_script_invite(
    name: string,
    max_age = 0,
    max_uses = 0
  ): Promise<script_invite> {
    const script = await this.get_script_by_name(name);

    const response = await http.post(
      `scripts/${script.script_id}/invites`,
      {
        max_age: max_age.toString(),
        max_uses: max_uses.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.invite || []);
    });
  }

  public async delete_script_invite(
    name: string,
    invite_id: number
  ): Promise<boolean> {
    const script = await this.get_script_by_name(name);

    const response = await http.delete(
      `scripts/${script.script_id}/invites`,
      {
        invite_id: invite_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.success || false);
    });
  }

  public async get_config_subscriptions(): Promise<config_subscription[]> {
    const response = await http.get("configs/subscriptions", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.subscriptions || []);
    });
  }

  public async get_config_subscription_by_name(
    name: string
  ): Promise<config_subscription[]> {
    const config = await this.get_config_by_name(name);

    const response = await http.get(
      `configs/${config.config_id}/subscriptions`,
      this.headers
    );
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.subscriptions || []);
    });
  }

  public async add_config_subscription(
    name: string,
    user_id: number
  ): Promise<config_subscription> {
    const config = await this.get_config_by_name(name);

    const response = await http.post(
      `configs/${config.config_id}/subscriptions`,
      {
        user_id: user_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.subscription || []);
    });
  }

  public async remove_config_subscription(
    name: string,
    user_id: number
  ): Promise<boolean> {
    const config = await this.get_config_by_name(name);

    const response = await http.delete(
      `configs/${config.config_id}/subscriptions`,
      {
        user_id: user_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body || []);
    });
  }

  public async get_script_subscriptions(): Promise<script_subscription[]> {
    const response = await http.get("scripts/subscriptions", this.headers);
    const body = response.body;

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(body.subscriptions || []);
    });
  }

  public async get_script_subscription_by_name(
    name: string
  ): Promise<script_subscription[]> {
    const script = await this.get_script_by_name(name);
    const response = await http.get(
      `scripts/${script.script_id}/subscriptions`,
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.subscriptions || []);
    });
  }

  public async add_script_subscription(
    name: string,
    user_id: number
  ): Promise<script_subscription> {
    const script = await this.get_script_by_name(name);
    const response = await http.post(
      `scripts/${script.script_id}/subscriptions`,
      {
        user_id: user_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.subscription || []);
    });
  }

  public async remove_script_subscription(
    name: string,
    user_id: number
  ): Promise<boolean> {
    const script = await this.get_script_by_name(name);
    const response = await http.delete(
      `scripts/${script.script_id}/subscriptions`,
      {
        user_id: user_id.toString(),
      },
      this.headers
    );

    onetap.handle_errors(response);

    return new Promise((resolve) => {
      resolve(response.body.success || false);
    });
  }

  // eslint-disable-next-line
  public on(event: event, func: (...args: any[]) => void): void {
    this.emitter.on(event, func);
  }

  public async tick(): Promise<void> {
    this.emitter.emit("tick");

    if (this.emitter.listenerCount("config-subscription")) {
      const subs = await this.get_config_subscriptions();
      const data = JSON.stringify(subs);

      if (this.old_data.configs.subs && this.old_data.configs.subs !== data) {
        this.emitter.emit("config-subscription");
      }

      this.old_data.configs.subs = data;
    }
  }
}

export default onetap;
