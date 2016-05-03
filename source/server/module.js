const winston = Npm.require('winston');

Space.Module.define('Space.logging.Winston', {

  dependencies: {
    configuration: 'configuration',
    log: 'Space.Logger'
  },

  onInitialize() {
    const log = this.injector.get('log');
    let transports = lodash.get(this.configuration, 'log.winston.transports', []);
    if (lodash.isEmpty(transports)) {
      transports = [this._setupWinstonConsoleTransport()];
    }

    const adapter = new Space.Logger.WinstonAdapter(winston, transports);
    this.injector.map('Space.Logger.WinstonAdapter').toStaticValue(adapter);
    log.addAdapter('winston', adapter);
  },

  _setupWinstonConsoleTransport() {
    const options = {
      colorize: true,
      prettyPrint: true,
      level: 'info'
    };
    return new winston.transports.Console(options);
  }
});
