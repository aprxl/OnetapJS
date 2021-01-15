/*
*
* Title: Onetap API
* Author: april#0001
* Description: A library to easily use Onetap's API system.
*
*/

//region Dependencies
const https = require( "https" );
const query = require( "querystring" );
//endregion

//region Constants
const METHOD = {
    GET: 0,
    POST: 1,
    DELETE: 2,
    DELETE_PARAM: 3
};
//endregion

//region Classes
class OnetapAPI {
	constructor( client_id, client_secret, api_key ) {
		this.clientID = client_id;
		this.clientSecret = client_secret;
		this.apiKey = api_key;
	}

	SetClientID( data ) {
        this.clientID = data;
    }

    SetClientSecret( data ) {
        this.clientSecret = data;
    }

    SetAPIKey( data ) {
        this.apiKey = data;
    }

    IsSetup( ) {
        return this.clientID && this.clientSecret && this.apiKey;
    }

    GenerateOptions( method, path, query ) {
        switch( method ) {
            case METHOD.GET:
                return {
                    'hostname': "www.onetap.com",
                    'path': path,
                    'method': "GET",
                    'headers': {
                        "CF-Access-Client-Id": this.clientID,
                        "CF-Access-Client-Secret": this.clientSecret,
                        "XF-Api-Key": this.apiKey
                    }
                };

            case METHOD.POST:
                return {
                    'hostname': "www.onetap.com",
                    'path': path,
                    'method': "POST",
                    'headers': {
                        "CF-Access-Client-Id": this.clientID,
                        "CF-Access-Client-Secret": this.clientSecret,
                        "XF-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(query)
                    }
                };

            case METHOD.DELETE:
                return {
                    'hostname': "www.onetap.com",
                    'path': path,
                    'method': "DELETE",
                    'headers': {
                        "CF-Access-Client-Id": this.clientID,
                        "CF-Access-Client-Secret": this.clientSecret,
                        "XF-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }

            case METHOD.DELETE_PARAM:
                return {
                    'hostname': "www.onetap.com",
                    'path': path,
                    'method': "DELETE",
                    'headers': {
                        "CF-Access-Client-Id": this.clientID,
                        "CF-Access-Client-Secret": this.clientSecret,
                        "XF-Api-Key": this.apiKey,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(query)
                    }
                }

            default:
                return console.log("[ONETAP] Invalid method type.");
        }
    }

    HandleErrors( data ) {
        var obj = JSON.parse(data);

        obj.false = false;

        if ( !obj.errors )
            return obj;

        try {
            switch( obj.errors[0].code ) {
                case "endpoint_not_found":
                    throw ("[ONETAP] [API] Invalid endpoint.");
    
                case "invalid_request_header_content_type":
                    throw ("[ONETAP] [API] Invalid header content type.");
    
                case "requested_user_not_found":
                    throw ("[ONETAP] [API] The requested user could not be found.");
    
                case "requested_config_not_found":
                    throw ("[ONETAP] [API] The requested configuration could not be found.");
    
                case "requested_script_not_found":
                    throw ("[ONETAP] [API] The requested script could not be found.");
    
                case "requested_script_not_found":
                    throw ("[ONETAP] [API] The requested script could not be found.");
    
                case "config_name_cannot_be_empty":
                    throw ("[ONETAP] [API] The configuration's name cannot be empty.");
    
                case "config_name_exceeds_max_length":
                    throw ("[ONETAP] [API] The configuration's name is too big.");
    
                case "config_name_only_alphanumeric_underscore":
                    throw ("[ONETAP] [API] The configuration's name has invalid characters.");
    
                case "config_data_cannot_be_empty":
                    throw ("[ONETAP] [API] The configurations's data cannot be empty.");
    
                case "config_data_contains_unexpected_contents":
                    throw ("[ONETAP] [API] The configuration's data has invalid contents.");
    
                case "script_name_cannot_be_empty":
                    throw ("[ONETAP] [API] The scripts's name cannot be empty.");
    
                case "script_name_exceeds_max_length":
                    throw ("[ONETAP] [API] The scripts's name is too big.");
    
                case "script_name_only_alphanumeric_underscore":
                    throw ("[ONETAP] [API] The scripts's name has invalid characters.");
    
                case "script_data_cannot_be_empty":
                    throw ("[ONETAP] [API] The scripts's data cannot be empty.");
    
                case "script_data_contains_unexpected_contents":
                    throw ("[ONETAP] [API] The scripts's data has invalid contents.");
    
                case "config_subscription_already_exists":
                    throw "[ONETAP] [API] This user already has the specified configuration.";
    
                case "requested_config_subscription_not_found":
                    throw ("[ONETAP] [API] This configuration's subscriptions could not be found.");
    
                case "script_subscription_already_exists":
                    throw ("[ONETAP] [API] This user already has the specified script.");
    
                case "requested_script_subscription_not_found":
                    throw ("[ONETAP] [API] This script's subscriptions could not be found.");
    
                default:
                    throw ("[ONETAP] [API] Unexpected error occured.")
            }
        }

        catch (e) {
            return {
                failed: true,
                error: e
            };
        }
    }

    async GetConfigs( callback ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/configs/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = JSON.parse(data);

                if ( obj.failed )
                    callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [obj.configs]);
            });
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );        
    }

    async GetConfig( callback, id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, `/api/configs/${id}/` );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data);

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [obj.config]);
            });
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );   
    }

    async UpdateConfig( callback, id, name, data ) {
        if (!this.IsSetup( ))
            return console.log("[ONETAP] Invalid header keys.");

        const q = ((name, data) => {
            var _q = { };

            if ( name )
                _q[ "name" ] = name;

            if ( data )
                _q[ "data" ] = data;

            return query.stringify(_q);
        })( name, data );

        const options = this.GenerateOptions(METHOD.POST, `/api/configs/${id}`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data);

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async AddConfig( callback, name, data ) {
        if (!this.IsSetup( ))
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'name': name,
            'data': data
        });

        const options = this.GenerateOptions(METHOD.POST, "/api/configs/", q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data);

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async DeleteConfig( callback, id ) {
        if (!this.IsSetup( ))
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.DELETE, `/api/configs/${id}`);

        const req = https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data);

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if (callback)
                    callback.apply(null, [ ]);
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.end( );
    }

    async GetConfigByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/configs/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var config;
                var obj = this.HandleErrors(data);

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                for (let cfg of obj.configs) {
                    if (cfg.name === name) {
                        config = cfg;
                        break;
                    }
                }

                if (!config) 
                    return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a configuration with such name."}]);
                    
                if (callback)
                    callback.apply(null, [config]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );   
    }

    async UpdateConfigByName( callback, name, new_name, data ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigByName((cfg) => {
            if (!cfg)
                return;

            this.UpdateConfig(callback, cfg.config_id, new_name, data);
        }, name);
    }

    async DeleteConfigByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigByName((cfg) => {
            if (!cfg)
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a configuration with such name."}]);

            this.DeleteConfig(callback, cfg.config_id);
        }, name)
    }

    async GetConfigSubscriptions( callback ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigs((list) => {
            var subs = { };

            for ( let cfg of list ) {
                if ( cfg.subscriptions.length > 0 )
                    subs[ cfg.name ] = cfg.subscriptions
            }

            if ( callback )
                callback.apply(null, [subs]);
        })
    }

    async GetConfigSubscriptionsByID( callback, config_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

            const options = this.GenerateOptions( METHOD.GET, `/api/configs/${config_id}/subscriptions/` );
        
            https.request(options, (res) => {
                var data = '';
    
                res.on("data", (chunk) => {
                    data += chunk;
                });
    
                res.on("end", () => {
                    var obj = this.HandleErrors(data);

                    if ( obj.failed )
                        return callback.apply(null, [obj]);

                    if ( callback )
                        callback.apply(null, [obj.subscription]);
                });
    
            })
            .on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
            .end( );
    }

    async GetConfigSubscriptionsByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigSubscriptions((list) => {
            if ( !list[name] )
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] There are no subscriptions for this configuration."}]);

            callback.apply(null, [list[name]]);
        });
    }

    async AddConfigSubscription( callback, config_id, user_id )
    {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.POST, `/api/configs/${config_id}/subscriptions`, q );

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply( null, [ ] );
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async DeleteConfigSubscription( callback, config_id, user_id )
    {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.DELETE_PARAM, `/api/configs/${config_id}/subscriptions/`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply( null, [ ] );
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async AddConfigSubscriptionByName( callback, name, user_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigByName((cfg) => {
            if (!cfg)
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a configuration with such name."}]);

            this.AddConfigSubscription(callback, cfg.config_id, user_id)
        }, name);
    }

    async DeleteConfigSubscriptionByName( callback, name, user_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetConfigSubscriptionsByName((list) => {
            var cfg_id = -1;
            var user_has_item = false;

            for ( let sub of list ) {
                if ( sub.user_id == user_id ) {
                    cfg_id = sub.config_id;
                    user_has_item = true;
                    break;
                }
            }

            if ( !user_has_item )
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] This user does not have an active subscription for this item."}]);

            this.DeleteConfigSubscription(callback, cfg_id, user_id);
        }, name);
    }
    
    async GetScripts( callback ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/scripts/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [obj.scripts]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );        
    }

    async GetScript( callback, id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, `/api/scripts/${id}/` );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [obj.scripts]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );   
    }

    async GetScriptSubscriptions( callback ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScripts((list) => {
            var subs = { };

            for ( let cfg of list ) {
                if ( cfg.subscriptions.length > 0 )
                    subs[ cfg.name ] = cfg.subscriptions
            }

            if ( callback )
                callback.apply(null, [subs]);
        })
    }

    async GetScriptSubscriptionsByID( callback, script_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, `/api/scripts/${script_id}/subscriptions/` );
    
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [obj.subscription]);
            });

            res.on("error", (err) => {
                return console.log(`[ONETAP] [GET] ${err.message}`);
            });
        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );
    }

    async GetScriptSubscriptionsByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptSubscriptions((list) => {
            if (!list[name])
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] There are no subscriptions for this script."}]);

            callback.apply(null, [list[name]]);
        });
    }

    async AddScriptSubscription( callback, script_id, user_id )
    {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.POST, `/api/scripts/${script_id}/subscriptions`, q );

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply( null, [ ] );
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async DeleteScriptSubscription( callback, script_id, user_id )
    {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.DELETE_PARAM, `/api/scripts/${script_id}/subscriptions/`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply( null, [ ] );
            })
        })

        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async AddScriptSubscriptionByName( callback, name, user_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((scr) => {
            if (!scr)
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a script with such name."}]);

            this.AddScriptSubscription(callback, scr.script_id, user_id)
        }, name);
    }

    async DeleteScriptSubscriptionByName( callback, name, user_id ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptSubscriptionsByName((list) => {
            var scr_id = -1;
            var user_has_item = false;

            for ( let sub of list ) {
                if ( sub.user_id == user_id ) {
                    scr_id = sub.script_id;
                    user_has_item = true;
                    break;
                }
            }

            if ( !user_has_item )
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] This user does not have an active subscription for this item."}]);

            this.DeleteScriptSubscription(callback, scr_id, user_id);
        }, name);
    }

    async UpdateScript( callback, id, name ) {
        if (!this.IsSetup( ))
            return console.log("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'name': name
        });

        const options = this.GenerateOptions(METHOD.POST, `/api/scripts/${id}`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.write(q);
        req.end( );
    }

    async DeleteScript( callback, id ) {
        if (!this.IsSetup( ))
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.DELETE, `/api/scripts/${id}`);

        const req = https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                var obj = this.HandleErrors(data)

                if ( obj.failed )
                    return callback.apply(null, [obj]);

                if (callback)
                    callback.apply(null, [ ]);
            })
        })
        
        req.on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        req.end( );
    }

    async GetScriptByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/scripts/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var script;
                var obj = this.HandleErrors(data)

                if (obj.failed)
                    return callback.apply(null, [obj]);

                for (let scr of obj.scripts) { 
                    if (scr.name === name) {
                        script = scr;
                        break;
                    }
                }

                if (!script) 
                    return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a script with such name."}]);

                if (callback)
                    callback.apply(null, [script]);
            });

        })
        .on("error", (err) => {
            return console.log(`[ONETAP] [GET] ${err.message}`);
        })
        .end( );   
    }

    async UpdateScriptByName( callback, name, new_name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((scr) => {
            if (!scr)
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a script with such name."}]);

            this.UpdateScript(callback, scr.script_id, new_name);
        }, name);
    }

    async DeleteScriptByName( callback, name ) {
        if ( !this.IsSetup( ) )
            return console.log("[ONETAP] Invalid header keys.");

        this.GetScriptByName((scr) => {
            if (!scr)
                return callback.apply(null, [{failed: true, error: "[ONETAP] [API] Couldn't find a script with such name."}]);

            this.DeleteScript(callback, scr.script_id);
        }, name)
    }

}
//endregion

//region Exports
module.exports = OnetapAPI;
//endregion