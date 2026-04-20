#!/usr/bin/env node

/**
 * PM2 Ecosystem Config for Production Deployment
 * Usage: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'diaspora',
      script: './app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: ['app.js', 'config.js', 'routes/', 'controllers/', 'services/', 'views/'],
      ignore_watch: ['node_modules', 'data', 'public', 'logs'],
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-user/diaspora-node.git',
      path: '/var/www/diaspora',
      'post-deploy':
        'npm install && npm run generate-index && pm2 restart ecosystem.config.js --env production',
    },
  },
};
