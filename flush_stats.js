const Sample = require('redis-time-series-ts').Sample;
const post_stats = require('./post_stats').post_stats;

const flush_stats = function rts_flush(timestamp, metrics) {
    const counters = metrics['counters'];
    const counterRates = metrics['counter_rates'];
    const gauges = metrics['gauges'];
    const timers = metrics['timers'];
    const timer_data = metrics['timer_data'];
    const sets = metrics['sets'];
    const stats = [];
    // Counter stats
    for (let counter in counters) {
        let sample = new Sample(counter, counters[counter], timestamp);
        stats.push(sample);
    }
    // Gauge stats
    for (let gauge in gauges) {
        let sample = new Sample(gauge, gauges[gauge], timestamp);
        stats.push(sample);
    }
    // Timer stats
    for (let timer in timer_data) {
        for (let timer_stat in timer_data[timer]) {
            let sample = new Sample(`${timer}.${timer_stat}`, timer_data[timer][timer_stat], timestamp);
            stats.push(sample);
        }
    }
    // Sets stats
    for (let set in sets) {
        let count = Object.keys(sets[set].store).length;
        let sample = new Sample(set, count, timestamp);
        stats.push(sample);
    }
    if (stats.length > 0) {
        post_stats(stats, timestamp);
    }
};
exports.flush_stats = flush_stats;
