const RedisTimeSeriesFactory = require('redis-time-series-ts').RedisTimeSeriesFactory;
let handler = module.exports = {
    rtsDB: null,
    pipeline: null,
    options: {},
    retention: 0,
    rtsStats: {},
    setup_rts: function rts_setup (redisHost, redisPort) {
        this.options['host'] = redisHost;
        this.options['port'] = redisPort;
        const factory = new RedisTimeSeriesFactory(this.options);
        this.rtsDB = factory.create();
        this.pipeline = this.rtsDB.provider.client.pipeline();
    },
    
    add: function pipeline_add (stat,retention,labels) {
        this.pipeline.call('TS.ADD', stat.key, stat.timestamp, stat.value,'RETENTION',retention,'LABELS',labels ,1);
    }
}