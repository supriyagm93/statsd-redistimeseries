const { rtsStats } = require("./index");
const status = function rts_status(write) {
    console.log('status');
    for (let stat in rtsStats) {
        write(null, 'rts', stat, rtsStats[stat]);
    }
};
exports.status = status;
