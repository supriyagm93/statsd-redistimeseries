const backend = require('../index');
const statusLib = require('../status');
const flushLib = require("../flush_stats");
const eventsLib = require("events");
const events = new eventsLib.EventEmitter();

let config = {
    redisHost: 'localhost',
    redisPort: '6379'
};
const flushMock = {
    counters: {
      'statsd.bad_lines_seen': 0,
      'statsd.packets_received': 3,
      'statsd.metrics_received': 3,
      'deploys.test.myservice': 1
    },
    gauges: {},
    timers: {},
    timer_counters: {},
    sets: { uniques: { store: [Object] }, unique: { store: [Object] } },
    counter_rates: {
      'statsd.bad_lines_seen': 0,
      'statsd.packets_received': 0.3,
      'statsd.metrics_received': 0.3,
      'deploys.test.myservice': 0.1
    },
    timer_data: {},
    pctThreshold: [ 90 ],
    histogram: undefined,
    statsd_metrics: { processing_time: 0 }
};    

describe("statsd-redistimeseries", () => {

    describe("Backend Initialization", () => {
        test("it should fail if config and event not passed", ()=> {
            let isInit = backend.init(Date.now());
            expect(isInit).toBe(false);
        });
        test("it should initialize the backend", () => {
            let isInit = backend.init(Date.now(), config, events);
            expect(isInit).toBe(true);
        });
    });

    describe("Backend receives events", () => {
        const spyFlushStatsFn = jest.spyOn(flushLib, "flush_stats");    
        test("backend should call flush_stats on event flush", () => {
            spyFlushStatsFn.mockReturnValue('');
            events.emit('flush', Date.now(), flushMock);
            expect(spyFlushStatsFn).toHaveBeenCalled();
            spyFlushStatsFn.mockRestore();
        });

        const spyStatusFn = jest.spyOn(statusLib, "status");
        test("backend should call status on event status", () => {
            spyStatusFn.mockReturnValue('');
            events.emit('status');
            expect(spyStatusFn).toHaveBeenCalled();
            spyStatusFn.mockRestore();
        });
    });
});
