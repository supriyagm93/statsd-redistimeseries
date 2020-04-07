# statsd-redistimeseries
A javascript backend for StatsD with RedisTimeSeries.

# Overview
The StatsD-RedisTimeseries Backend for StatsD forwards metrics collected by the StatsD daemon into RedisTimeseries for retention, analytics, visualization, and alerting.


# Requirements
- Redis server 5.0
- RedisTimeSeries module in Redis

# Install
Install the StatsD-RedisTimeseries Backend with npm.

npm install statsd-redistimeseries

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
# Supported Variables

<table>
<th>testing</th>
<td>data</td>
</table>