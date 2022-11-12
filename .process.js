module.exports = {
    apps : [{
      name   : "API",
      script : "./app.js",
      instances: 2,
        env: {
      CONTACT_EMAIL: process.env.CONTACT_EMAIL,PASSWORD_EMAIL: process.env.PASSWORD_EMAIL,
            AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET
        },
    }]
  }
