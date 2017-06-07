import { hostname } from 'os';
import SDC from 'statsd-client';

const sdc = new SDC({
  host: 'l-lvs12vip7.ops.cn8.qunar.com',
  port: '8140',
  prefix: 'destination.qrmaps.api'
});

const name = hostname().split('.')[0] || 'default';
const { WATCHER_ENABLE } = process.env;

export const increment = (key, count) => {
  if (WATCHER_ENABLE === 'true') {
    sdc.increment(`${key}.${name}`, count);
  }
};

export const gauge = (key, count) => {
  if (WATCHER_ENABLE === 'true') {
    sdc.gauge(`${key}.${name}`, count);
  }
};

export const timing = (key, timer) => {
  if (WATCHER_ENABLE === 'true') {
    sdc.timing(`${key}.${name}`, timer);
  }
};
