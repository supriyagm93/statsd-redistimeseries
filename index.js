const RedisTimeSeriesFactory = require('redis-time-series-ts').RedisTimeSeriesFactory;
const Sample = require('redis-time-series-ts').Sample;

const options = {
    port: 6379,
    host: 'localhost'
}
let rtsDB = null;

const KEY_NOT_PRESENT_ERROR = 'TSDB: the key is not a TSDB key';

const flush_stats = function rts_flush(timestamp, metrics) {
    const counters = metrics['counters'];
    const counterRates = metrics['counter_rates'];
    const gauges = metrics['gauges'];
    const timers = metrics['timers'];
    const timer_data = metrics['timer_data'];
    const sets = metrics['sets'];
    
    const stats = [];
    // Counter stats
    for(let counter in counters) {
        let sample = new Sample(counter, counters[counter], timestamp);
        stats.push(sample);
    }
    // Gauge stats
    for(let gauge in gauges) {
        let sample = new Sample(gauge, gauges[gauge], timestamp);
        stats.push(sample);        
    }
    // Timer stats
    for(let timer in timer_data) {
        for(let timer_stat in timer_data[timer]) {
            let sample = new Sample(`${timer}.${timer_stat}`,
                            timer_data[timer][timer_stat] , 
                            timestamp);
            stats.push(sample);
        }
    }
    // Sets stats
    for(let set in sets) {
        let count = Object.keys(sets[set].store).length;
        let sample = new Sample(set, count, timestamp);
        stats.push(sample);
    }

    if(stats.length>0) {
        post_stats(stats, timestamp);
    }
}

const post_stats = async function rts_post_stats(stats, timestamp) {
    const multiAdded  = await rtsDB.multiAdd(stats);
    // O(n)
    // ToDo: is PipeLine optimization needed?
    for(let i in multiAdded){
        if(multiAdded[i].message == KEY_NOT_PRESENT_ERROR) {
            let added = await rtsDB.add(
                stats[i]
            );
        }
    }
}

const setup_rts = function rts_setup(redisHost, redisPort) {
    options['host'] = redisHost;
    options['port'] = redisPort;
    const factory = new RedisTimeSeriesFactory(options);
    return factory.create();
}

exports.init = function rts_init(startup_time, config, events, logger) {
    redisHost = config.redisHost || 'localhost';
    redisPort = config.redisPort || 6379;
    
    rtsDB = setup_rts(redisHost, redisPort);

    events.on('flush', flush_stats)
    return true;
}