# statsd-redistimeseries
A javascript backend for StatsD with RedisTimeSeries.

# Overview
The StatsD-RedisTimeseries Backend for StatsD forwards metrics collected by the StatsD daemon into RedisTimeseries for retention, analytics, visualization, and alerting.


# Requirements
- Redis server 5.0
- RedisTimeSeries module in Redis

# Install
Install the StatsD-RedisTimeseries Backend with npm.
```
npm install statsd-redistimeseries

```
# Configuration
Install this backend and configure statsd to use it
```
{
  redis: [{
      host: 'localhost',
      port: 6379,
      prefixCounter:'counter',
      prefixTimer:'timer',
      prefixGauge:'gauge',
      prefixSet:'set',
      password:'',
      retention:500000
  
    }],
  
    backends:[ "/../statsd-redistimeseries" ], 
}
```
# Supported Variables

| Variable  | Description | Default Value |
| ------------- | ------------- |-------------  |
| redis.host  | Redis hostname  | localhost |
| redis.port  | Redis port  | 6379 |
| redis.debug  | Enable debug logging.Possible values: true, false. | false |
| redis.password  | Password for Redis Login | "" |
| redis.prefixCounter  | Prefix for counter metrics | "counters" |
| redis.prefixTimer  | Prefix for timer metrics | "timers" |
| redis.prefixGauge  | Prefix for gauge metrics | "gauges" |
| redis.prefixSet  | Prefix for set metrics| "sets" |

# Plugin Source Code

https://git.hashedin.com/samrudh.s/statsd-redistimeseries


# Metrics 

The basic metrics data that the StatsD client sends contains three things: a metric name, its value, and a metric type. This data is formatted this way:

``` <metric_name>:<metric_value>|<metric_type> ```

 * Metric name (also called a bucket) is pretty self-explanatory. One key thing to remember is to  name your metric in a way that aims to avoid confusion or misinterpretation later. 

 * Metric value is the number associated with that metric’s performance at collection time. The actual value will depend on the type of metric which you are collecting data for.

* Metric type defines what type of data the metric actually represents. StatsD supports several metric types, including counters, gauges, timers, and sets.

 ```Example: page.login.users:1|c ``` 

