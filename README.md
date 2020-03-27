# statsd-redistimeseries
A javascript backend for StatsD with RedisTimeSeries.

# Requirements
- Redis server 5.0
- RedisTimeSeries module in Redis

# Install

# Configuration
Just install this backend in statsD and configure it in statsD config file.
```
{
 redisHost: 'localhost'
,redisPort: 6379
, port: 8125
, backends: [ "../statsd-redistimeseries/index" ]
}
```
