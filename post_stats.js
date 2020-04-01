const KEY_NOT_PRESENT_ERROR = 'TSDB: the key is not a TSDB key';
const client_handler = require('./client_handler');

const post_stats = async function rts_post_stats(stats, timestamp) {
    let startTime = Date.now();
    let multiAdded, pipelineResults;
    // multiAdd pipelines multiple adds into a single command
    multiAdded = await client_handler.rtsDB.multiAdd(stats);

    client_handler.rtsStats.multi_flush_time = (Date.now() - startTime);
    
    // Add redis calls to pipeline
    for(let i in multiAdded) {
        if(multiAdded[i].message == KEY_NOT_PRESENT_ERROR) {
            client_handler.add(stats[i]);
        }
    }
    // execute commands in pipeline and get results
    // returns array of [error, result]
    pipelineResults = await client_handler.pipeline.exec();

    for(let result of pipelineResults) {
        if(result[0] == null){
            client_handler.rtsStats.last_exception = Math.round(Date.now()/1000);
        }
    }

    client_handler.rtsStats.flush_time = (Date.now() - startTime);
    client_handler.rtsStats.flush_length = stats.length;
    client_handler.rtsStats.last_flush = Math.round(Date.now() / 1000);
};
exports.post_stats = post_stats;
