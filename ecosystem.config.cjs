module.exports = {
  apps: [
    {
      name: 'youtube-scrap',
      script: 'npm',
      args: 'run scrap',
      cwd: __dirname,
      cron_restart: '0 * * * *',
      autorestart: false,
      watch: false,
      time: true,
    },
  ],
};
