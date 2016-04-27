Space.Module.define('Space.logging.Winston', {

  dependencies: {
    configuration: 'configuration',
    log: 'Space.Logger'
  },

  onInitialize() {
    const log = this.injector.get('log');

    const transports = lodash.get(this.configuration, 'log.winston.transports', [
      this._setupWinstonConsoleTransport()
    ]);
    const adapter = new Space.Logger.WinstonAdapter(transports);
    this.injector.map('Space.Logger.WinstonAdapter').toStaticValue(adapter);
    log.addAdapter('winston', adapter);
  },

  _setupWinstonConsoleTransport(options) {
    const mergedOptions = _.extend({}, {
      colorize: true,
      prettyPrint: true,
      level: 'info'
    }, options);
    return Space.Logger.WinstonAdapter.console(mergedOptions);
  }
});
