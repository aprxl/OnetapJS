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
                        "XF-Api-Key": this.apiKey
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
                throw new Error("[ONETAP] Invalid method type.");
        }
    }

    async GetConfigs( callback ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/configs/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = JSON.parse(data);

                if ( callback )
                    callback.apply(null, [obj.configs]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );        
    }

    async GetConfig( callback, id ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, `/api/configs/${id}/` );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = JSON.parse(data);

                if ( callback )
                    callback.apply(null, [obj.config]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );   
    }

    async UpdateConfig( callback, id, name, data ) {
        if (!this.IsSetup( ))
            throw new Error("[ONETAP] Invalid header keys.");

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
                console.log(data);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.write(q);
        req.end( );
    }

    async AddConfig( callback, name, data ) {
        if (!this.IsSetup( ))
            throw new Error("[ONETAP] Invalid header keys.");

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
                console.log(data);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.write(q);
        req.end( );
    }

    async DeleteConfig( callback, id ) {
        if (!this.IsSetup( ))
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.DELETE, `/api/configs/${id}`);

        const req = https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                console.log(data);

                if (callback)
                    callback.apply(null, [ ]);
            })
        })
        
        req.end( );
    }

    async GetConfigByName( callback, name ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/configs/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var config;
                var obj = JSON.parse(data);

                for (let cfg of obj.configs) {
                    if (cfg.name === name) {
                        config = cfg;
                        break;
                    }
                }

                if (!config) 
                    throw new Error(`[ONETAP] Couldn't find a configuration called ${name}.`);
                    
                if (callback)
                    callback.apply(null, [config]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );   
    }

    async UpdateConfigByName( callback, name, new_name, data ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        this.GetConfigByName((cfg) => {
            this.UpdateConfig(callback, cfg.config_id, new_name, data);
        }, name);
    }

    async DeleteConfigByName( callback, name ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        this.GetConfigByName((cfg) => {
            this.DeleteConfig(callback, cfg.config_id);
        }, name)
    }

    async AddConfigSubscription( callback, config_id, user_id )
    {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

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
                if ( callback )
                    callback.apply( null, [ ] );
            })
        })
        
        req.write(q);
        req.end( );
    }

    async DeleteConfigSubscription( callback, config_id, user_id )
    {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.DELETE_PARAM, `/api/configs/${config_id}/subscriptions/`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
                console.log(data);
            })

            res.on("end", () => {
                if ( callback )
                    callback.apply( null, [ ] );
            })
        })

        req.write(q);
        req.end( );
    }
    
    async GetScripts( callback ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/scripts/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = JSON.parse(data);

                if ( callback )
                    console.log(data)
                    callback.apply(null, [obj.scripts]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );        
    }

    async GetScript( callback, id ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, `/api/scripts/${id}/` );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var obj = JSON.parse(data);

                if ( callback )
                    callback.apply(null, [obj.scripts]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );   
    }

    async AddScriptSubscription( callback, script_id, user_id )
    {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

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
                if ( callback )
                    callback.apply( null, [ ] );
            })
        })
        
        req.write(q);
        req.end( );
    }

    async DeleteScriptSubscription( callback, script_id, user_id )
    {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const q = query.stringify({
            'user_id': user_id
        });

        const options = this.GenerateOptions( METHOD.DELETE_PARAM, `/api/scripts/${script_id}/subscriptions/`, q);

        const req = https.request(options, (res) => {
            var data = '';

            res.setEncoding("utf8");

            res.on("data", (chunk) => {
                data += chunk;
                console.log(data);
            })

            res.on("end", () => {
                if ( callback )
                    callback.apply( null, [ ] );
            })
        })

        req.write(q);
        req.end( );
    }

    async UpdateScript( callback, id, name ) {
        if (!this.IsSetup( ))
            throw new Error("[ONETAP] Invalid header keys.");

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
                console.log(data);

                if ( callback )
                    callback.apply(null, [ ]);
            })
        })
        
        req.write(q);
        req.end( );
    }

    async DeleteScript( callback, id ) {
        if (!this.IsSetup( ))
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions(METHOD.DELETE, `/api/scripts/${id}`);

        const req = https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            })

            res.on("end", () => {
                console.log(data);

                if (callback)
                    callback.apply(null, [ ]);
            })
        })
        
        req.end( );
    }

    async GetScriptByName( callback, name ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        const options = this.GenerateOptions( METHOD.GET, "/api/scripts/" );
        
        https.request(options, (res) => {
            var data = '';

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                var script;
                var obj = JSON.parse(data); 

                for (let scr of obj.scripts) { 
                    if (scr.name === name) {
                        script = scr;
                        break;
                    }
                }

                if (!script) 
                    throw new Error(`[ONETAP] Couldn't find a script called ${name}.`);
                    
                if (callback)
                    callback.apply(null, [script]);
            });

            res.on("error", (err) => {
                console.log(`[ONETAP] [GET] ${err.message}`);
            })
        })
        .end( );   
    }

    async UpdateScriptByName( callback, name ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        this.GetScriptByName((src) => {
            /*const q = query.stringify({
                'name': name
            });
    
            const options = this.GenerateOptions(METHOD.POST, `/api/scripts/${src.script_id}`, q);
    
            const req = https.request(options, (res) => {
                var data = '';
    
                res.setEncoding("utf8");
    
                res.on("data", (chunk) => {
                    data += chunk;
                })
    
                res.on("end", () => {
                    console.log(data);
    
                    if ( callback )
                        callback.apply(null, [ ]);
                })
            })
            
            req.write(q);
            req.end( );*/

            this.UpdateScript(callback, src.script_id, name);
        }, name);
    }

    async DeleteScriptByName( callback, name ) {
        if ( !this.IsSetup( ) )
            throw new Error("[ONETAP] Invalid header keys.");

        this.GetScriptByName((scr) => {
            /*const options = this.GenerateOptions(METHOD.DELETE, `/api/script/${cfg.config_id}`);

            const req = https.request(options, (res) => {
                var data = '';
    
                res.on("data", (chunk) => {
                    data += chunk;
                })
    
                res.on("end", () => {
                    console.log(data);
    
                    if (callback)
                        callback.apply(null, [cfg]);
                })
            })
            
            req.end( );*/

            this.DeleteScript(callback, scr.script_id);
        }, name)
    }

}
//endregion

//region Exports
module.exports = OnetapAPI;
//endregion