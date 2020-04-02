const flush_stats = require("./flush_stats");
const status = require("./status");
const client_handler = require('./client_handler');

exports.init = function rts_init(startup_time, config, events, logger) {
    if(!config || !events) {
        return false;
    }
    let redisHost = config.redisHost || 'localhost';
    let redisPort = config.redisPort || 6379;
    
    client_handler.setup_rts(redisHost, redisPort);
    client_handler.retention = config.retention;
    client_handler.rtsStats.last_flush = startup_time;
    client_handler.rtsStats.last_exception = startup_time;
    client_handler.rtsStats.multi_flush_time = 0;
    client_handler.rtsStats.flush_time = 0;
    client_handler.rtsStats.flush_length = 0;

    let retention =  module.exports = {
        retention : config.retention || 0
    }

    events.on('flush', flush_stats.flush_stats);
    events.on('status', status.status);
    return true;
}
