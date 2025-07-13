// server.js
const express = require('express');
const mongoose = require('mongoose');
const client = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500] // buckets for response time
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(console.error);

const telemetrySchema = new mongoose.Schema({
  droneId: String,
  latitude: Number,
  longitude: Number,
  timestamp: Date
});

const Telemetry = mongoose.model('Telemetry', telemetrySchema);

app.get('/health', async (req, res) => {
  let telemetryOk = false;
  let metricsOk = false;

  // Check telemetry
  try {
    await Telemetry.findOne();
    telemetryOk = true;
  } catch (err) {
    console.error('Telemetry check failed:', err.message);
  }

  // Check metrics
  try {
    await client.register.metrics();
    metricsOk = true;
  } catch (err) {
    console.error('Metrics check failed:', err.message);
  }

  if (telemetryOk && metricsOk) {
    res.status(200).send('OK');
  } else {
    res.status(500).json({
      status: 'Unhealthy',
      telemetry: telemetryOk,
      metrics: metricsOk
    });
  }
});

app.post('/telemetry', async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;
  try {
    const data = new Telemetry(req.body);
    await data.save();
    res.status(201).json({ message: 'Telemetry received' });
    end({ route, code: 201, method: req.method });
  } catch (err) {
    res.status(500).json({ error: err.message });
    end({ route, code: 500, method: req.method });
  }
});

app.get('/telemetry', async (req, res) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  const route = req.route.path;

  try {
    const data = await Telemetry.find().sort({ timestamp: -1 });
    res.status(200).json(data);
    end({ route, code: 200, method: req.method });
  } catch (err) {
    res.status(500).json({ error: err.message });
    end({ route, code: 500, method: req.method });
  }
});


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

