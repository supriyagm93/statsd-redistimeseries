const Sample = require('redis-time-series-ts').Sample;
const Label =  require('redis-time-series-ts').Label;
const post_stats = require('./post_stats').post_stats;

const flush_stats = function rts_flush(timestamp, metrics) {
    const counters = metrics['counters'];
    const counterRates = metrics['counter_rates'];
    const gauges = metrics['gauges'];
    const timers = metrics['timers'];
    const timer_data = metrics['timer_data'];
    const sets = metrics['sets'];
    const stats = [];
    const label =[];
    // Counter stats
    for (let counter in counters) {
        let sample = new Sample(counter, counters[counter], timestamp);
        let labelvalue = new Label("counter");
        label.push(labelvalue)
        stats.push(sample);
    }
    // Gauge stats
    for (let gauge in gauges) {
        let sample = new Sample(gauge, gauges[gauge], timestamp);
        let labelvalue = new Label("gauge");
        label.push(labelvalue);
        stats.push(sample);
    }
    // Timer stats
    for (let timer in timer_data) {
        for (let timer_stat in timer_data[timer]) {
            let sample = new Sample(`${timer}.${timer_stat}`, timer_data[timer][timer_stat], timestamp);
            let labelvalue = new Label("timer");
            label.push(labelvalue);
            stats.push(sample);
        }
    }
    // Sets stats
    for (let set in sets) {
        let count = Object.keys(sets[set].store).length;
        let sample = new Sample(set, count, timestamp);
        let labelvalue = new Label("set");
        label.push(labelvalue);
        stats.push(sample);
    }
    if (stats.length > 0) {
        post_stats(stats, timestamp,label);
    }
};
exports.flush_stats = flush_stats;
