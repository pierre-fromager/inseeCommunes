/* eslint no-class-assign: "off" */
class Config {
  constructor() {
    this.host = 'localhost';
    this.port = 27017;
    this.login = 'pierre';
    this.password = 'pierre';
    this.credentials = `${this.login}:${this.password}@`;
    this.db = 'insee';
    this.collection = 'communes';
    this.dsn = `mongodb://${this.credentials}${this.host}:${this.port}`;
    this.clientOptions = {
      useNewUrlParser: true,
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    };
  }
}
Config = new Config();
module.exports = Config;
