module.exports = {
    apps : [{
      name   : "API",
      script : "./app.js",
      instances: 2,
        env: {
      CONTACT_EMAIL: "dayday.calendar@gmail.com",
      PASSWORD_EMAIL:"azmbpapitchxwott",
            AUTH_TOKEN_SECRET:"8b20767f35dc8446e55ee8cbf20b44910f1e007bcca918a7e859d" +
                "01fb6d0df5c342f9b480d7bc92a48d7f2524d14a949fb8c6acb85f420366a2b8d51117fe607"
        },
    }]
  }