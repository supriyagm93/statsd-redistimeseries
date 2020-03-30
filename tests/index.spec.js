const backend = require('../index');
jest.spyOn(backend, 'status').mockImplementation(()=>{
    console.log('running');
})
const eventsLib = require("events");
const events = new eventsLib.EventEmitter();
// const status = require('../status');
// jest.spyOn(status, 'status').mockImplementation(()=>{
//     console.log('hi');
// })

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
    // console.log(backend);
    describe("Backend Initialization", () => {
        test("it should initialize the backend", () => {
            let isInit = backend.init(Date.now(), config, events);
            expect(isInit).toBe(true);
        });
    });

    describe("Backend receives events", () => {
        // const flush_stats = jest.spyOn(backend, 'flush_stats');    
        // test("backend should call flush_stats on event flush", () => {
        //     events.emit('flush', Date.now(), flushMock);
        //     console.log(flush_stats);
        //     expect(flush_stats).toHaveBeenCalled();
        // });
        test("backend should call status on event status", () => {
            events.emit('status');
            expect(backend.status).toHaveBeenCalled()
        });
    });
});