const KEY_NOT_PRESENT_ERROR = 'TSDB: the key is not a TSDB key';
const client_handler = require('./client_handler');
const Label = require('redis-time-series-ts').Label;

const post_stats = async function rts_post_stats(stats, timestamp,label) {
    let startTime = Date.now();
    let multiAdded;
    // multiAdd pipelines multiple adds into a single command
    multiAdded = await client_handler.rtsDB.multiAdd(stats);

    client_handler.rtsStats.multi_flush_time = (Date.now() - startTime);
    for (let i in multiAdded) {
        if (multiAdded[i].message == KEY_NOT_PRESENT_ERROR) {
            let added = await client_handler.rtsDB.add(stats[i],[new Label((stats[i]['key']+'.'+label[i]['name']),1)],retention);
            if (Number.isInteger(added)) {
                client_handler.rtsStats.last_exception = Math.round(Date.now() / 1000);
            }
        }
    }
    client_handler.rtsStats.flush_time = (Date.now() - startTime);
    client_handler.rtsStats.flush_length = stats.length;
    client_handler.rtsStats.last_flush = Math.round(Date.now() / 1000);
};
exports.post_stats = post_stats;
