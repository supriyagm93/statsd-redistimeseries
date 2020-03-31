const {rtsStats} = require('./client_handler');
const status = function rts_status(write) {
    for (let stat in rtsStats) {
        write(null, 'rts', stat, rtsStats[stat]);
    }
};
exports.status = status;
