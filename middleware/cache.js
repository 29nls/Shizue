// Simple cache middleware for GET requests
const config = require('../config');

const cache = {};

const cacheMiddleware = (duration = config.cache.ttl) => {
  return (req, res, next) => {
    if (!config.cache.enable || req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedData = cache[key];

    if (cachedData && Date.now() - cachedData.timestamp < duration * 1000) {
      res.setHeader('X-Cache', 'HIT');
      return res.send(cachedData.content);
    }

    const originalSend = res.send;
    res.send = function (data) {
      cache[key] = {
        content: data,
        timestamp: Date.now(),
      };
      res.setHeader('X-Cache', 'MISS');
      return originalSend.call(this, data);
    };

    next();
  };
};

// Clear cache
const clearCache = (key) => {
  if (key) {
    delete cache[key];
  } else {
    for (const k in cache) {
      delete cache[k];
    }
  }
};

module.exports = cacheMiddleware;
module.exports.clearCache = clearCache;
