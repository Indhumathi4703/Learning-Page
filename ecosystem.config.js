module.exports = {
  apps: [{
    script: 'server.js',
    watch: true,
    env: {
      PORT: 8080,
      NODE_ENV: "local",
      dbUrl: "mongodb+srv://codemaddy47:a4RBnetYLTP2tBEY@cluster0.nvdqygb.mongodb.net/imageupload_s3"

    }
  }],
};
