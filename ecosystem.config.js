module.exports = {
  apps: [{
    script: 'server.js',
    watch: true,
    env: {
      PORT: 8080,
      NODE_ENV: "local",
    }
  }],
};
