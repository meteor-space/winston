Space.Module.define('Space.logging.Winston', {

  dependencies: {
    configuration: 'configuration',
    log: 'Space.Logger'
  },

  onInitialize() {
    const log = this.injector.get('log');
    let transports = lodash.get(this.configuration, 'log.winston.transports', []);
    if (lodash.isEmpty(transports)) {
      transports = [this._setupWinstonConsoleTransport()]
    }

    const adapter = new Space.Logger.WinstonAdapter(transports);
    this.injector.map('Space.Logger.WinstonAdapter').toStaticValue(adapter);
    log.addAdapter('winston', adapter);
  },

  _setupWinstonConsoleTransport() {
    const options = {
      colorize: true,
      prettyPrint: true,
      level: 'info'
    };
    return Space.Logger.WinstonAdapter.console(options);
  }
});
