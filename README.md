# statsd-redistimeseries
A javascript backend for StatsD with RedisTimeSeries.

# Requirements
- Redis server 5.0
- RedisTimeSeries module in Redis

# Install

# Configuration
Install this backend and configure statsd to use it
```
{
 redisHost: 'localhost',
 redisPort: 6379, 
 port: 8125, 
 backends: [ "../statsd-redistimeseries" ]
}
```
