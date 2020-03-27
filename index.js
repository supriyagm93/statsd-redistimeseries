const RedisTimeSeriesFactory = require('redis-time-series-ts').RedisTimeSeriesFactory;
const Sample = require('redis-time-series-ts').Sample;

const options = {
    port: 6379,
    host: 'localhost'
}
let rtsDB = null;

const KEY_NOT_PRESENT_ERROR = 'TSDB: the key is not a TSDB key';

const flush_stats = function rts_flush(timestamp, metrics) {
    const stats = [];
    console.log("meow",metrics);
    const counters = metrics['counters'];
    const counterRates = metrics['counter_rates'];
    
    for(let counter in counters) {
        let metricObject = {};
        metricObject['type'] = 'counter';
        metricObject['name'] = counter;
        metricObject['count'] = counters[counter];
        metricObject['rate'] =  counterRates[counterRates] || 0;
        stats.push(metricObject);
    }

    if(stats.length>0) {
        post_stats(stats, timestamp);
    }
}

const post_stats = async function rts_post_stats(stats, timestamp) {
    console.log('posting stats', stats);
    // const created = await rtsDB.create('meow');
    // console.log(created); 
    let samples = [];

    for(let stat of stats) {
        samples.push(new Sample(stat.name, stat.count, timestamp));
    }
    const multiAdded  = await rtsDB.multiAdd(samples);

    // O(n)
    // ToDo: is PipeLine optimization needed?
    for(let i in multiAdded){
        if(multiAdded[i].message != KEY_NOT_PRESENT_ERROR) {
            let added = await rtsDB.add(
                samples[i]
            );
        }
    }
}

const setup_rts = function rts_setup(redisHost, redisPort) {
    options['host'] = redisHost;
    options['port'] = redisPort;
    console.log(options);
    const factory = new RedisTimeSeriesFactory(options);
    return factory.create();
}

exports.init = function rts_init(startup_time, config, events, logger) {
    redisHost = config.redisHost || 'localhost';
    redisPort = config.redisPort || 6379;
    
    rtsDB = setup_rts(redisHost, redisPort);
    console.log(rtsDB);

    events.on('flush', flush_stats)
    return true;
}