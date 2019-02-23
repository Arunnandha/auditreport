const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  config: {
    user: process.env.SQL_USER,
    password: process.env.PASSWORD,
    port: process.env.SQL_PORT,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: { encrypt: true }
  },
  accessKey: process.env.ACCESS_KEY,
  storageAccount: process.env.STORAGE_ACCOUNT,
  container: process.env.CONTAINER,
  secretkey: process.env.JWD_TOKEN_PWD,
  port: process.env.PORT
};
