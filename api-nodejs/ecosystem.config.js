module.exports = {
  apps: [
    {
      name: 'hms-api',
      script: 'npm',
      args: 'run production',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
    },
  ],
};
