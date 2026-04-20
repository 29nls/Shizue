const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const cacheMiddleware = require('./middleware/cache');
const mobileDetect = require('./middleware/mobileDetect');
const languageDetect = require('./middleware/languageDetect');

// Import routes
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/post');
const archiveRoutes = require('./routes/archive');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const pageRoutes = require('./routes/page');
const apiRoutes = require('./routes/api');
const searchRoutes = require('./routes/search');

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Compression
app.use(compression());

// Logging
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', config.paths.viewsDir);

// Static files
app.use(express.static(config.paths.publicDir, {
  maxAge: config.isDev ? 0 : '1d',
  etag: false,
}));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Custom logger
app.use(logger);

// Mobile detection middleware (redirects /m/ for mobile users)
app.use(mobileDetect);

// Language detection middleware (handles multi-language routing)
app.use(languageDetect);

// Routes
app.use('/', indexRoutes);
app.use('/post', postRoutes);
app.use('/archive', archiveRoutes);
app.use('/category', categoryRoutes);
app.use('/tag', tagRoutes);
app.use('/page', pageRoutes);
app.use('/api', apiRoutes);
app.use('/search', searchRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  const helpers = require('./controllers/helpers');
  res.status(404).render('error', {
    config,
    helpers,
    status: 404,
    message: 'Page not found',
  });
});

// Error handler - must be last
app.use(errorHandler);

// Start server with port retry logic
const PORT = config.port;
let server;

const startServer = (port) => {
  server = app.listen(port, () => {
    console.log(`\n✅ Diaspora Node.js server running on http://localhost:${port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🌍 Site: ${config.site.title}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${port} is already in use.`);
      console.log(`🔄 Trying port ${port + 1}...\n`);
      
      if (port < 3010) {
        // Try next port
        startServer(port + 1);
      } else {
        console.error('❌ Could not find available port. Please kill the process using port 3000:');
        console.error('   Get-Process -Name node | Stop-Process -Force');
        process.exit(1);
      }
    } else {
      throw err;
    }
  });
};

startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏹ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⏹ SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
