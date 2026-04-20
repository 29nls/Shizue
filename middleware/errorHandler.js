// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const helpers = require('../controllers/helpers');

  res.status(status).render('error', {
    config: require('../config'),
    helpers,
    status,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

module.exports = errorHandler;
