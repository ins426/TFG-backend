module.exports = {
    apps : [{
      name   : "API",
      script : "./app.js",
      instances: 2,
        env: {
      CONTACT_EMAIL: "***REMOVED***",
      PASSWORD_EMAIL:"***REMOVED***",
            AUTH_TOKEN_SECRET:"***REMOVED***" +
                "***REMOVED***"
        },
    }]
  }