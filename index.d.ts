// Automatically generated.

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
declare type event = 'tick' | 'config-subscription';
export default class onetap {
    private headers;
    private emitter;
    private old_data;
    private static handle_errors;
    constructor(api_key: string, tick_delay?: number);
    get_key(): string;
    set_key(new_key: string): void;
    get_configs(): Promise<config[]>;
    get_config_by_name(name: string): Promise<config>;
    get_config_id(name: string): Promise<number>;
    get_config_name(id: number): Promise<string>;
    get_scripts(): Promise<script[]>;
    get_script_by_name(name: string): Promise<script>;
    get_script_id(name: string): Promise<number>;
    get_script_name(id: number): Promise<string>;
    get_config_invites(): Promise<config_invite[]>;
    get_config_invite_by_name(name: string): Promise<config_invite[]>;
    create_config_invite(name: string, max_age?: number, max_uses?: number): Promise<config_invite>;
    delete_config_invite(name: string, invite_id: number): Promise<boolean>;
    get_script_invites(): Promise<script_invite[]>;
    get_script_invite_by_name(name: string): Promise<script_invite[]>;
    create_script_invite(name: string, max_age?: number, max_uses?: number): Promise<script_invite>;
    delete_script_invite(name: string, invite_id: number): Promise<boolean>;
    get_config_subscriptions(): Promise<config_subscription[]>;
    get_config_subscription_by_name(name: string): Promise<config_subscription[]>;
    add_config_subscription(name: string, user_id: number): Promise<config_subscription>;
    remove_config_subscription(name: string, user_id: number): Promise<boolean>;
    get_script_subscriptions(): Promise<script_subscription[]>;
    get_script_subscription_by_name(name: string): Promise<script_subscription[]>;
    add_script_subscription(name: string, user_id: number): Promise<script_subscription>;
    remove_script_subscription(name: string, user_id: number): Promise<boolean>;
    on(event: event, func: (...args: any[]) => void): void;
    tick(): Promise<void>;
}
