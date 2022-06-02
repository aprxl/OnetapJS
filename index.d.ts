/**
 * A onetap configuration struct.
 * @interface
 */
interface config {
  readonly config_id: number;
  readonly user_id: number;
  readonly name: string;
  readonly data: string;
  readonly created: number;
  readonly updated: number;
}

/**
 * A onetap script struct.
 */
interface script {
  readonly script_id: number;
  readonly user_id: number;
  readonly name: string;
  readonly created: number;
  readonly updated: number;
}

/**
 * A onetap configuration invite struct.
 */
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

/**
 * A onetap script invite struct.
 */
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

/**
 * A onetap configuration subscription struct.
 */
interface config_subscription {
  readonly config_id: number;
  readonly created: number;
  readonly status: string;
  readonly updated: number;
  readonly user_id: number;
}

/**
 * A onetap script subscription struct.
 */
interface script_subscription {
  readonly script_id: number;
  readonly created: number;
  readonly status: string;
  readonly updated: number;
  readonly user_id: number;
}

/**
 * All available event listeners
 */
declare type event = "tick" | "config-subscription";

/**
 * A Onetap API wrapper
 * @class
 */
export default class Onetap {
  /**
   * The class's constructor. Will return a instance of Onetap
   * @param {string} api_key The API key you can find on your forum settings.
   * @param {number?} tick_delay The delay between ticks. Used to handle callbacks.
   * @constructor
   */
  public constructor(api_key: string, tick_delay?: number);

  /**
   * Returns the current API key.
   * @returns {string}
   */
  public get_key(): string;

  /**
   * Overrides the current API key with a new one.
   * @param {string} new_key The new API key.
   */
  public set_key(new_key: string): void;

  /**
   * Returns a promise with all your Onetap configurations.
   * @returns {Promise<config[]>}
   */
  get_configs(): Promise<config[]>;

  /**
   * Returns a promise with a specific Onetap configuration.
   * @param {string} name The name of the configuration.
   * @returns {Promise<config>}
   */
  get_config_by_name(name: string): Promise<config>;

  /**
   * Returns a promise with a specific Onetap configuration's index.
   * @param {string} name The name of the configuration.
   * @returns {Promise<number>}
   */
  get_config_id(name: string): Promise<number>;

  /**
   * Returns a promise with a specific Onetap configuration's name.
   * Use this to retrieve a configuration's name by its index.
   * @param {number} id The index of the configuration.
   * @returns {Promise<string>}
   */
  get_config_name(id: number): Promise<string>;

  /**
   * Returns a promise with all your Onetap scripts.
   * @returns {Promise<script[]>}
   */
  get_scripts(): Promise<script[]>;

  /**
   * Returns a promise with a specific Onetap script.
   * @param {string} name The name of the script.
   * @returns {Promise<script>}
   */
  get_script_by_name(name: string): Promise<script>;

  /**
   * Returns a promise with a specific Onetap script's index.
   * @param {string} name The name of the script.
   * @returns {Promise<number>}
   */
  get_script_id(name: string): Promise<number>;

  /**
   * Returns a promise with a specific Onetap script's name.
   * Use this to retrieve a script's name by its index.
   * @param {number} id The index of the script
   * @returns {Promise<string>}
   */
  get_script_name(id: number): Promise<string>;

  /**
   * Returns a promise with all your configuration invites.
   * @returns {Promise<config_invite[]>}
   */
  get_config_invites(): Promise<config_invite[]>;

  /**
   * Returns a promise with all invites for a specific configuration.
   * @param {string} name The name of the configuration.
   * @returns {Promise<config_invite[]>}
   */
  get_config_invite_by_name(name: string): Promise<config_invite[]>;

  /**
   * Creates a new configuration invite and returns it on success.
   * @param {string} name The name of the configuration
   * @param {number?} max_age The expiry date invite (0 = Never, 1 = One hour, 2 = Three hours, 3 = Six hours, 4 = Twelve hours, 5 = 24 hours, 6 = 48 hours)
   * @param {number?} max_uses The maximum amount of uses (0 = Infinite, 1 = One use, 2 = Five uses, 3 = Ten uses, 4 = 25 uses, 5 = 50 uses, 6 = 100 uses)
   * @returns {Promise<config_invite>}
   */
  create_config_invite(
    name: string,
    max_age?: number,
    max_uses?: number
  ): Promise<config_invite>;

  /**
   * Deletes an already existing configuration invite and returns true on success.
   * @param {string} name The name of the configuration
   * @param {number} invite_id The index of the invite
   * @returns {Promise<boolean>}
   */
  delete_config_invite(name: string, invite_id: number): Promise<boolean>;

  /**
   * Returns a promise with all your script invites.
   * @returns {Promise<script_invite[]>}
   */
  get_script_invites(): Promise<script_invite[]>;

  /**
   * Returns a promise with all invites for a specific script.
   * @param {string} name The name of the script.
   * @returns {Promise<script_invite[]>}
   */
  get_script_invite_by_name(name: string): Promise<script_invite[]>;

  /**
   * Creates a new script invite and returns it on success.
   * @param {string} name The name of the script
   * @param {number?} max_age The expiry date invite (0 = Never, 1 = One hour, 2 = Three hours, 3 = Six hours, 4 = Twelve hours, 5 = 24 hours, 6 = 48 hours)
   * @param {number?} max_uses The maximum amount of uses (0 = Infinite, 1 = One use, 2 = Five uses, 3 = Ten uses, 4 = 25 uses, 5 = 50 uses, 6 = 100 uses)
   * @returns {Promise<script_invite>}
   */
  create_script_invite(
    name: string,
    max_age?: number,
    max_uses?: number
  ): Promise<script_invite>;

  /**
   * Deletes an already existing script invite and returns true on success.
   * @param {string} name The name of the script
   * @param {number} invite_id The index of the invite
   * @returns {Promise<boolean>}
   */
  delete_script_invite(name: string, invite_id: number): Promise<boolean>;

  /**
   * Returns a promise with all your configuration subscriptions.
   * @returns {Promise<config_subscription[]>}
   */
  get_config_subscriptions(): Promise<config_subscription[]>;

  /**
   * Returns a promise with all subscriptions of a specific configuration.
   * @returns {Promise<config_subscription[]>}
   */
  get_config_subscription_by_name(name: string): Promise<config_subscription[]>;

  /**
   * Adds a Onetap user as a subscriber to one of your configurations.
   * @param {string} name The name of the configuration.
   * @param {number} user_id The UserID (UID) of the user.
   * @returns {Promise<config_subscription>}
   */
  add_config_subscription(
    name: string,
    user_id: number
  ): Promise<config_subscription>;

  /**
   * Removes the subscription of a Onetap user from one of your configurations.
   * @param {string} name The name of the configuration.
   * @param {number} user_id The UserID (UID) of the user.
   * @returns {Promise<boolean>}
   */
  remove_config_subscription(name: string, user_id: number): Promise<boolean>;

  /**
   * Returns a promise with all your script subscriptions.
   * @returns {Promise<script_subscription[]>}
   */
  get_script_subscriptions(): Promise<script_subscription[]>;

  /**
   * Returns a promise with all subscriptions of a specific script.
   * @returns {Promise<script_subscription[]>}
   */
  get_script_subscription_by_name(name: string): Promise<script_subscription[]>;

  /**
   * Adds a Onetap user as a subscriber to one of your scripts.
   * @param {string} name The name of the script.
   * @param {number} user_id The UserID (UID) of the user.
   * @returns {Promise<script_subscription>}
   */
  add_script_subscription(
    name: string,
    user_id: number
  ): Promise<script_subscription>;

  /**
   * Removes the subscription of a Onetap user from one of your scripts.
   * @param {string} name The name of the script.
   * @param {number} user_id The UserID (UID) of the user.
   * @returns {Promise<boolean>}
   */
  remove_script_subscription(name: string, user_id: number): Promise<boolean>;

  /**
   * Register a new event callback.
   * Experimental.
   * @param {event} event The name of the event
   * @param {Function} func The callback
   */
  on(event: event, func: (...args: any[]) => void): void;

  /**
   * The logic function for all callbacks. Must be called in order to
   * allow callbacks to be used.
   * Experimental.
   */
  tick(): Promise<void>;
}
