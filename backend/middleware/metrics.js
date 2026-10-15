const client = require('prom-client');

// Initialize Prometheus Register
const register = new client.Registry();

// Add default recommended system & Node.js metrics
client.collectDefaultMetrics({
  register,
  prefix: 'godevops_'
});

// HTTP Request Duration Histogram
const httpRequestDurationSeconds = new client.Histogram({
  name: 'godevops_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});
register.registerMetric(httpRequestDurationSeconds);

// Total HTTP Requests Counter
const httpRequestsTotal = new client.Counter({
  name: 'godevops_http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestsTotal);

// Active Requests Gauge
const activeRequestsGauge = new client.Gauge({
  name: 'godevops_active_requests',
  help: 'Number of active HTTP requests currently processing'
});
register.registerMetric(activeRequestsGauge);

// Baseline initialization so graphs never show 'No data' on startup
httpRequestsTotal.labels('GET', '/api/health', '200').inc(0);
httpRequestDurationSeconds.labels('GET', '/api/health', '200').observe(0.005);

// Express Middleware to intercept and record traffic
const metricsMiddleware = (req, res, next) => {
  // Exclude /metrics from being counted to prevent metric pollution
  if (req.path === '/metrics') {
    return next();
  }

  activeRequestsGauge.inc();
  const start = process.hrtime();

  res.on('finish', () => {
    activeRequestsGauge.dec();
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    // Normalize path to prevent high cardinality (e.g. /api/rooms/:id)
    let route = req.baseUrl + (req.route ? req.route.path : req.path);
    if (!route || route === '') {
      route = req.path;
    }

    const labels = {
      method: req.method,
      route: route,
      status_code: res.statusCode.toString()
    };

    httpRequestDurationSeconds.observe(labels, durationInSeconds);
    httpRequestsTotal.inc(labels);
  });

  next();
};

// Expose metrics handler
const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  metricsEndpoint
};
