const flush_stats = require("./flush_stats");
const status = require("./status");
const client_handler = require('./client_handler');

exports.init = function rts_init(startup_time, config, events, logger) {
    if(!config || !events) {
        return false;
    }
     let redisHost = config.host || 'localhost';
    let redisPort = config.port || 6379;
    let redisPassword = config.redis.password || '';

    client_handler.setup_rts(redisHost, redisPort,redisPassword);
    client_handler.retention = config.redis.retention || 5000;
    client_handler.rtsStats.last_flush = startup_time;
    client_handler.rtsStats.last_exception = startup_time;
    client_handler.rtsStats.multi_flush_time = 0;
    client_handler.rtsStats.flush_time = 0;
    client_handler.rtsStats.flush_length = 0;
    //prefix values

    client_handler.prefixCounter = config.redis.prefixCounter || 'counter';
    client_handler.prefixTimer = config.redis.prefixTimer || 'timer';
    client_handler.prefixGauge = config.redis.prefixGauge || 'gauge';
    client_handler.prefixSet = config.redis.prefixSet || 'set';

    events.on('flush', flush_stats.flush_stats);
    events.on('status', status.status);
    return true;
}
